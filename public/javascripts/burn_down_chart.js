$(document).ready(function(){
  var count_of_sprint = parseInt($('.project-run input[name=count_date_of_sprint]').val());
  var sprint_number =parseInt($('.project-run input[name=sprint_number]').val());

  var start_date = new Date($('#sprint_start').text());
  var date_of_sprint = [];
  var format_date = start_date.getFullYear()+"/"+(start_date.getMonth()+1)+"/"+start_date.getDate();
  date_of_sprint.push(format_date);
  for (var i = 1; i <= count_of_sprint; i++) {
    start_date.setDate(start_date.getDate() + 1);
    var format_date = start_date.getFullYear()+"/"+(start_date.getMonth()+1)+"/"+start_date.getDate();
    date_of_sprint.push(format_date);
  };
  /*----------------------------------------------------------------------------------*/
  $('#BurnDown').highcharts({
    title: {
        text: 'BurnDown Chart',
        x: -20 //center
    },
    xAxis: {
        categories: date_of_sprint
    },
    yAxis: {
        title: {
            text: 'Point'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    tooltip: {
        valueSuffix: '°C'
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
    },
    series: [{
        name: 'Sprint '+ sprint_number,
        data: [7.0, 6.9, 9.5]
    }]
  });
});