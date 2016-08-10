name := "ktrace-log-reporter"

organization := "io.kamon"

scalaVersion := "2.11.5"

resolvers ++= Seq(
  "Nexus Snapshots Repository" at "http://nexus.despegar.it:8080/nexus/content/repositories/releases",
  "Sonatype releases" at "https://oss.sonatype.org/content/repositories/releases/",
  "Sonatype snapshots" at "https://oss.sonatype.org/content/repositories/snapshots/",
  "Typesafe Repository" at "http://repo.typesafe.com/typesafe/releases/"
)

libraryDependencies ++= Seq(
  "io.kamon" %% "kamon-core" % "0.5.1",
  "org.slf4j" % "slf4j-api" % "1.7.21",
  "ch.qos.logback" % "logback-classic" % "1.1.1"
)

publishTo := {
  if(version.value.endsWith("SNAPSHOT"))
    Some("Nexus snapshots" at "http://nexus.despegar.it:8080/nexus/content/repositories/snapshots/")
  else
    Some("Nexus releases" at "http://nexus.despegar.it:8080/nexus/content/repositories/releases/")
}