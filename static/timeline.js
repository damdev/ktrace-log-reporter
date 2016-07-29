AmCharts.useUTC = true;

$( document ).ready(function() {

  function drawItems(lines) {
    $('div#items').empty();
    for (var i = 0; i < lines.length; i++) {
      var item = lines[i];
      writeItem(item);
    }

    function formatHead(s) {
      var parts = s.split('#');
      return parts[0]+"("+parts[1]+")"
    }

    function formatAlt(s) {
      var parts = s.split('#');
      return "start:" + parts[2] + " duration:" + parts[3];
    }

    function writeItem(rawLine) {
      var match = /^.*logReportTrace: (.*)$/g.exec(rawLine);
      if(match) {
        var item = match[1];
        var itemParts = item.split('!');
        $('div#items').append('<li><a href="#" class="item" data-segments="' + itemParts[1] + '" alt="' + formatAlt(itemParts[0]) + '">' + formatHead(itemParts[0]) + '</li>');
      }
    }

    $('.item').on('click', function(event) {
      var segs = $(event.target).data('segments');
      chart.dataProvider = parseAm(segs);
      chart.validateData();
    });

    function parseAmWithHeader(line) {
        var vals = line.split('!');
        var header = vals[0];
        var data = vals[1];
        return {
          'header': header,
          'data': data
        };
    }
}

  function parseAm(data) {
    var segments = data.split('|');
    var t0 = parseInt(segments[0].split('#')[1]);
    var res = segments.map(function(currentValue, index, array) {
        var parts = currentValue.split('#');
        return {
          'category': parts[0],
          'segments': [
            {
              'task': parts[0],
              'start': parseInt(parts[1])-t0,
              'duration': parseInt(parts[2])
            }
          ]
        };
    });
    //console.log(JSON.stringify(res));
    /*res.sort(function(a, b) {
      return a.segments[0].start < b.segments[0].start;
    });*/
    return res;
  }

  var chart = AmCharts.makeChart("chartdiv", {
    "type": "gantt",
    "theme": "light",
    "period": "fff",
    "dataDateFormat": "YYYY-MM-DD HH:NN:SS",
    "balloonDateFormat": "QQQ",
    "columnWidth": 0.5,
    "marginBottom": 30,
    "valueAxis": {
      "type": "date",
      "minPeriod": "fff",
      "ignoreAxisWidth": true
    },
    "brightnessStep": 10,
    "graph": {
      "fillAlphas": 1,
      "balloonText": "<b>[[task]]</b>: [[duration]]ms"
    },
    "rotate": true,
    "categoryField": "category",
    "segmentsField": "segments",
    "colorField": "color",
    "startDate": "2015-01-01 00:00:00",
    "startField": "start",
    "endField": "end",
    "durationField": "duration",
    "dataProvider": parseAm('AuditController.auditpost#1469806580498804321#2701067839|AuditController.parseRequestBody#1469806580500900540#372440038|AuditController.process#1469806580882069065#2317430120|AuditValidator.validate1#1469806580884369913#29592902|AuditValidator.validate2#1469806580888536022#21709488|AuditValidator.validateAdditionalFilters#1469806580908003243#2138712|AuditController.translateAndResolveAll#1469806580920139739#528504837|AuditController.translate#1469806580924143942#32502328|AuditResolver.resolve#1469806580988220396#460268930|AuditResolver.audit#1469806581185860548#262534395|AuditController.save#1469806581451808021#1727853001|TxSupport.connection#1469806581454709614#19196004|TxSupport.begin#1469806581479168719#2683665|AuditProvider.savesWithinSession#1469806581568069499#1596937800|TxSupport.commit#1469806583167480783#11627356|AuditController.logAuditSizeToInsights#1469806583182687460#16495897'),
    "valueScrollbar": {
      "autoGridCount": true
    },
    "chartCursor": {
      "cursorColor": "#55bb76",
      "valueBalloonsEnabled": false,
      "cursorAlpha": 0,
      "valueLineAlpha": 0.5,
      "valueLineBalloonEnabled": true,
      "valueLineEnabled": true,
      "zoomable": true,
      "valueZoomable": true
    }
  });


  $('button#draw').on('click', function() {
    var lines = document.getElementById('data').value.split('\n');
    drawItems(lines);
  });

});