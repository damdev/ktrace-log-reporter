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
      return parts[0]+"("+parts[1]+")" + " duration:" + parseInt(parts[3].replace('.nanos', '')/1000000) + "ms";
    }

    function writeItem(rawLine) {
      var match = /^.*logReportTrace: (.*)$/g.exec(rawLine);
      if(match) {
        var item = match[1];
        var itemParts = item.split('!');
        $('div#items').append('<li><a href="#" class="item" data-segments="' + itemParts[1] + '" data-head="' + itemParts[0] + '">' + formatHead(itemParts[0]) + '</li>');
      }
    }

    $('.item').on('click', function(event) {
      var head = $(event.target).data('head');
      var t0 = parseInt(head.split('#')[2].replace('.nanos', ''))

      var segs = $(event.target).data('segments');
      chart.dataProvider = [parseAmHead(head, t0)].concat(parseAm(segs, t0));
      chart.validateData();
    });

}

  function parseAmHead(head, t0) {
    var parts = head.split('#');
    return {
        'category': parts[1],
        'segments': [
          {
            'task': parts[1],
            'start': parseInt(parts[2].replace('.nanos', '')) -t0,
            'duration': parseInt(parts[3].replace('.nanos', ''))
          }
        ]
      };
  }

  function parseAm(data, t0) {
    var segments = data.split('|');
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
    "dataProvider": [],
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