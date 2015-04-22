$(document).ready(function(){
  var note = new Note();
  var socketconnect = new SocketConnect();
  var socket = socketconnect.connect();
  var dash_chart = {
    column : 4,
    sprint_number : parseInt($('.project-run input[name=sprint_number]').val()),
    project_id : $('input[name=idproject]').val(),
  }
  var count_of_sprint = parseInt($('.project-run input[name=count_date_of_sprint]').val());
  var sprint_number =parseInt($('.project-run input[name=sprint_number]').val());

  var start_date = new Date($('#sprint_start').text());
  var date_of_sprint = [];
  var format_date = start_date.getFullYear()+"/"+(start_date.getMonth()+1)+"/"+start_date.getDate();
  date_of_sprint.push("start");
  date_of_sprint.push(format_date);
  for (var i = 1; i <= count_of_sprint; i++) {
    start_date.setDate(start_date.getDate() + 1);
    var format_date = start_date.getFullYear()+"/"+(start_date.getMonth()+1)+"/"+start_date.getDate();
    date_of_sprint.push(format_date);
  };
  var count_point = parseInt($('#param_project input[name=count_point]').val());
  /*----------------------------------------------------------------------------------*/
  var count_user_story = parseInt($('#param_project input[name=count_note]').val());

  note.get_note_done(dash_chart, function(list_note_done) {
    var note_number_of_date = [];
    note_number_of_date.push(count_point);
    var total_note = [];
    total_note[0] = 0;
    for (var i = 1; i < date_of_sprint.length; i++) {
      total_note[i] = total_note[i-1];
      for (var j = 0; j < list_note_done.length; j++) {
        if(list_note_done[j].date_complete == date_of_sprint[i]) {
          total_note[i]+= list_note_done[j].estimate;
        }
      };
      note_number_of_date.push(count_point-total_note[i]);
    };
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
          tickInterval: 2,
          min: 0,
          max: count_point,
          plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
          }]
      },
      tooltip: {
          valueSuffix: 'Point'
      },
      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
      },
      series: [{
          name: 'Sprint '+ sprint_number,
          data: note_number_of_date,
      }]
    });
  });

  socket.on(dash_chart.project_id+'_caculate_chart', function (list_note_done) {
    var note_number_of_date = [];
    note_number_of_date.push(list_note_done.count_point);
    var total_note = [];
    total_note[0] = 0;
    for (var i = 1; i < date_of_sprint.length; i++) {
      total_note[i] = total_note[i-1];
      for (var j = 0; j < list_note_done.resNote.length; j++) {
        if(list_note_done.resNote[j].date_complete == date_of_sprint[i]) {
          total_note[i]+= list_note_done.resNote[j].estimate;
        }
      };
      note_number_of_date.push(list_note_done.count_point-total_note[i]);
    };
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
          tickInterval: 2,
          min: 0,
          max: list_note_done.count_point,
          plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
          }]
      },
      tooltip: {
          valueSuffix: 'Point'
      },
      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
      },
      series: [{
          name: 'Sprint '+ sprint_number,
          data: note_number_of_date,
      }]
    });

  });
});