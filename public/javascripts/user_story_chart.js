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

/********end X************/
  var count_user_story = parseInt($('#param_project input[name=count_note]').val());
  note.get_note_done(dash_chart, function(list_note_done) {
    var note_number_of_date = [];
    note_number_of_date.push(count_user_story);
    var total_note = [];
    total_note[0] = 0;
    for (var i = 1; i < date_of_sprint.length; i++) {
      total_note[i] = total_note[i-1];
      for (var j = 0; j < list_note_done.length; j++) {
        if(list_note_done[j].date_complete == date_of_sprint[i]) {
          total_note[i]++;
        }
      };
      note_number_of_date.push(count_user_story-total_note[i]);
    };
    $('#UserStory').highcharts({
      title: {
          text: 'User Story Chart',
          x: -20 //center
      },
      xAxis: {
          categories: date_of_sprint
      },
      yAxis: {
          title: {
              text: 'User Story'
          },
          tickInterval: 1,
          min: 0,
          max: count_user_story,
          plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
          }],
      },
      tooltip: {
          valueSuffix: 'Task'
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

/********************Socket Chart ********************/
  socket.on(dash_chart.project_id+'_caculate_chart', function (list_note_done) {
    var note_number_of_date = [];
    note_number_of_date.push(count_user_story);
    var total_note = [];
    total_note[0] = 0;
    for (var i = 1; i < date_of_sprint.length; i++) {
      total_note[i] = total_note[i-1];
      for (var j = 0; j < list_note_done.length; j++) {
        if(list_note_done[j].date_complete == date_of_sprint[i]) {
          total_note[i]++;
        }
      };
      note_number_of_date.push(count_user_story-total_note[i]);
    };
    console.log(note_number_of_date);
    $('#UserStory').highcharts({
      title: {
          text: 'User Story Chart',
          x: -20 //center
      },
      xAxis: {
          categories: date_of_sprint
      },
      yAxis: {
          title: {
              text: 'User Story'
          },
          tickInterval: 1,
          min: 0,
          max: count_user_story,
          plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
          }],
      },
      tooltip: {
          valueSuffix: 'Task'
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
