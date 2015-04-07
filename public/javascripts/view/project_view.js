$(document).ready(function() {
  var project = new Project();
  var alert = new Alert();
  var tooltip = new Tooltip();
  var socketconnect = new SocketConnect();
  var socket = socketconnect.connect();
  tooltip.show();
  socket.on('new_project_room', function (data) {
    $('.list-project').append('<div class="col-md-3"><a href="/project/'+ data.project._id+'" class="back-ground-red" data-toggle="tooltip" title="'+data.user.firstname+'"><span>'+data.project.title+'</span><label class="status-project img-circle">'+data.project.status+'</label></a></div>');
    tooltip.show();
  });
  $('#new-project').on('click', '#save-new-project', function(){
    var title = $('#title input').val();
    var datetime = $('#datetime input').val();
    if(title == "") {
      $('.new-content-project #title').addClass('has-error');
    }
    if(datetime =="") {
      $('.new-content-project #datetime').addClass('has-error');
    }
    if(title != "" && datetime !="") {
      var dateinput = new Date(datetime);
      var current = new Date();
      if(dateinput < current) {
        $('.new-content-project #datetime').addClass('has-error');
      }else {
        var data = {
          master : $('.new-content-project input[name=master]').val(),
          master_id : $('.new-content-project input[name=master_id]').val(),
          date : $('.new-content-project input[name=date]').val(),
          title : $('.new-content-project input[name=title]').val()
        }
        project.Addproject(data, alert, tooltip);
      }

    }
  });

  $('#new-project').on('click', '.close', function(){
    $('.new-content-project #title').removeClass('has-error');
    $('.new-content-project #datetime').removeClass('has-error');
  });

});