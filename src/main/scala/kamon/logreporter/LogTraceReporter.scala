/*
 * =========================================================================================
 * Copyright © 2013-2015 the kamon project <http://kamon.io/>
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 * =========================================================================================
 */

package kamon.logreporter

import akka.actor._
import akka.event.Logging
import ch.qos.logback.classic.Logger
import kamon.Kamon
import kamon.trace.{SegmentInfo, TraceInfo}
import kamon.util.{MilliTimestamp, RelativeNanoTimestamp}
import org.slf4j.LoggerFactory

object LogTraceReporter extends ExtensionId[LogTraceReporterExtension] with ExtensionIdProvider {
  override def lookup(): ExtensionId[_ <: Extension] = LogTraceReporter
  override def createExtension(system: ExtendedActorSystem): LogTraceReporterExtension = new LogTraceReporterExtension(system)
}

class LogTraceReporterExtension(system: ExtendedActorSystem) extends Kamon.Extension {
  val log = Logging(system, classOf[LogTraceReporterExtension])
  log.info("Starting the Kamon(LogReporter) extension")

  val subscriber = system.actorOf(Props[LogTraceReporterSubscriber], "kamon-trace-log-reporter")

  Kamon.tracer.subscribe(subscriber)

}

class LogTraceReporterSubscriber extends Actor with ActorLogging {
  val l = LoggerFactory.getLogger(classOf[LogTraceReporterSubscriber])
  def receive = {
    case TraceInfo(name, token, start, duration, _, segments) ⇒ {
      l.info("===========================================================================")
      l.info(s"logReportTrace: $name#$token#$start#$duration!${printTraceInfo(segments)}")
      l.info("===========================================================================")
    }
    case a => {
      l.info("===========================================================================")
      l.info(a.toString)
      l.info("===========================================================================")
    }
  }

  def printTraceInfo(segments: Seq[SegmentInfo]): String = segments.map(printSegment).mkString("|")

  def printSegment(segmentInfo: SegmentInfo): String = {
    s"${segmentInfo.name}#${segmentInfo.timestamp.nanos}#${segmentInfo.elapsedTime.nanos}"
  }
}