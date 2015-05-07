/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function() {
  $("#station").change();
});
function generateGraps() {
  var filterValues = $("#stations-form").serialize();
//  alert(filterValues);
  $.ajax({
    type: "POST",
//    dataType: "json",
    url: "/ajax/data-graphics.php",
    data: filterValues,
    success: function(result) {
      var objJSON = {};
      if (result != null) {
        objJSON = eval("(function(){return " + result + ";})()");
      } else {
//        objJSON = null;
      }
      var data = objJSON;
      if (('tmax' in data) || data['tmin'] || data['tmean']) {
        var period = $("#period").val();

        var seriesData = [];
        if (data['tmin']) {
          if (period == 1) {
            seriesData.push({
              name: 'T. min',
              data: data['tmin']['data'],
              pointStart: Date.UTC(data['tmin']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['tmin']['sdate'].split(' ')[0].split('-')[1]) - 1), parseInt(data['tmin']['sdate'].split(' ')[0].split('-')[2])),
              pointInterval: 24 * 3600 * 1000
            });
          } else if (period == 2) {
            dLen = data['tmin']['data'].length;
            for (var i = 0; i < dLen; i++) {
              data['tmin']['data'][i] = [Date.UTC(data['tmin']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['tmin']['sdate'].split(' ')[0].split('-')[1]) - 1 + i), 1), data['tmin']['data'][i]];
            }
            seriesData.push({
              name: 'T. min',
              data: data['tmin']['data']
            });
          } else if (period == 3) {
            dLen = data['tmin']['data'].length;
            for (var i = 0; i < dLen; i++) {
              data['tmin']['data'][i] = [Date.UTC((parseInt(data['tmin']['sdate'].split(' ')[0].split('-')[0]) + i), (parseInt(data['tmin']['sdate'].split(' ')[0].split('-')[1]) - 1), 1), data['tmin']['data'][i]];
            }
            seriesData.push({
              name: 'T. min',
              data: data['tmin']['data']
            });
          }
        }
        if (data['tmax']) {
          if (period == 1) {
            seriesData.push({
              name: 'T. max',
              data: data['tmax']['data'],
              pointStart: Date.UTC(data['tmax']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['tmax']['sdate'].split(' ')[0].split('-')[1]) - 1), parseInt(data['tmax']['sdate'].split(' ')[0].split('-')[2])),
              pointInterval: 24 * 3600 * 1000
            });
          } else if (period == 2) {
            dLen = data['tmax']['data'].length;
            for (var i = 0; i < dLen; i++) {
              data['tmax']['data'][i] = [Date.UTC(data['tmax']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['tmax']['sdate'].split(' ')[0].split('-')[1]) - 1 + i), 1), data['tmax']['data'][i]];
            }
            seriesData.push({
              name: 'T. max',
              data: data['tmax']['data']
            });
          } else if (period == 3) {
            dLen = data['tmax']['data'].length;
            for (var i = 0; i < dLen; i++) {
              data['tmax']['data'][i] = [Date.UTC((parseInt(data['tmax']['sdate'].split(' ')[0].split('-')[0]) + i), (parseInt(data['tmax']['sdate'].split(' ')[0].split('-')[1]) - 1), 1), data['tmax']['data'][i]];
            }
            seriesData.push({
              name: 'T. max',
              data: data['tmax']['data']
            });
          }

        }
        if (data['tmean']) {
          if (period == 1) {
            seriesData.push({
              name: 'T. mean',
              data: data['tmean']['data'],
              pointStart: Date.UTC(data['tmean']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['tmean']['sdate'].split(' ')[0].split('-')[1]) - 1), parseInt(data['tmean']['sdate'].split(' ')[0].split('-')[2])),
              pointInterval: 24 * 3600 * 1000
            });
          } else if (period == 2) {
            dLen = data['tmean']['data'].length;
            for (var i = 0; i < dLen; i++) {
              data['tmean']['data'][i] = [Date.UTC(data['tmean']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['tmean']['sdate'].split(' ')[0].split('-')[1]) - 1 + i), 1), data['tmean']['data'][i]];
            }
            seriesData.push({
              name: 'T. mean',
              data: data['tmean']['data']
            });
          } else if (period == 3) {
            dLen = data['tmean']['data'].length;
            for (var i = 0; i < dLen; i++) {
              data['tmean']['data'][i] = [Date.UTC((parseInt(data['tmean']['sdate'].split(' ')[0].split('-')[0]) + i), (parseInt(data['tmean']['sdate'].split(' ')[0].split('-')[1]) - 1), 1), data['tmean']['data'][i]];
            }
            seriesData.push({
              name: 'T. mean',
              data: data['tmean']['data']
            });
          }

        }
//        alert(seriesData);
        $('#temp').highcharts('StockChart',{
          chart: {
            type: 'spline',
            zoomType: 'x'
          },
          title: {
            text: 'Temperatura'
          },
          xAxis: {
            type: 'datetime',
            labels: {
              overflow: 'justify'
            }
          },
          yAxis: {
            title: {
              text: 'Temperature'
            }
          },
          tooltip: {
            valueSuffix: ' C',
            shared: true,
            valueDecimals: 2
          },
          plotOptions: {
            series: {
              turboThreshold: 15000//larger threshold or set to 0 to disable
            }
          },
          series: seriesData
        });
      }
      if (data['prec']) {
        dLen = data['prec']['data'].length;

        if (period == 1) {
          seriesData = {
            name: 'Precipitation',
            data: data['prec']['data'],
            pointStart: Date.UTC(data['prec']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['prec']['sdate'].split(' ')[0].split('-')[1]) - 1), parseInt(data['prec']['sdate'].split(' ')[0].split('-')[2])),
            pointInterval: 24 * 3600 * 1000
          };
        } else if (period == 2) {
          for (var i = 0; i < dLen; i++) {
            data['prec']['data'][i] = [Date.UTC(data['prec']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['prec']['sdate'].split(' ')[0].split('-')[1]) - 1 + i), 1), data['prec']['data'][i]];
          }
          seriesData = {
            name: 'Precipitation',
            data: data['prec']['data']
          };
        } else if (period == 3) {
          for (var i = 0; i < dLen; i++) {
            data['prec']['data'][i] = [Date.UTC((parseInt(data['prec']['sdate'].split(' ')[0].split('-')[0]) + i), (parseInt(data['prec']['sdate'].split(' ')[0].split('-')[1]) - 1), 1), data['prec']['data'][i]];
          }
          seriesData = {
            name: 'Precipitation',
            data: data['prec']['data']
          };
        }
        $('#prec').highcharts('StockChart',{
          chart: {
            type: 'spline',
            zoomType: 'x'
          },
          title: {
            text: 'Precipitation'
          },
          xAxis: {
            type: 'datetime',
            labels: {
              overflow: 'justify'
            }
          },
          yAxis: {
            title: {
              text: 'Precipitation mm/day'
            }
          },
          tooltip: {
            valueSuffix: ' mm/day',
            valueDecimals: 2
          },
          plotOptions: {
            series: {
              turboThreshold: 15000//larger threshold or set to 0 to disable
            }
          },
          series: [seriesData]
        });
      }
    },
    complete: function() {

    }
  });
}

