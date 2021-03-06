$(document).ready(function() {
  var project = new Project();
  // project.AddprojectTest();
  var tooltip = new Tooltip();
  var socketconnect = new SocketConnect();
  var socket = socketconnect.connect();
  tooltip.show();
  socket.on('new_project_room', function (data) {
    $('.list-project').append('<div class="col-md-3" data-project="'+data.project._id+'"><a href="/project/'+ data.project._id+'" class="back-ground-blue" data-toggle="tooltip" title="'+data.user.firstname+'"><span>'+data.project.title+'</span><label class="status-project img-circle">'+data.project.status+'</label></a></div>');
    tooltip.show();
  });
  $('#new-project').on('click', '#save-new-project', function(){
    var title = $('#title input').val();
    var datetime = $('#datetime input').val();
    var content_pdo = $('#pdo-project textarea').val();
    var spring = $('#spring input[name=spring]').val();
    if(title == "")
      $('.new-content-project #title').addClass('has-error');
    if(datetime =="")
      $('.new-content-project #datetime').addClass('has-error');
    if(content_pdo =="")
      $('.new-content-project #pdo-project').addClass('has-error');
    if(spring.match("^\\d+$") == null)
      $('.new-content-project #spring').addClass('has-error');
    if(title != "" && datetime !="" && content_pdo != "" && spring.match("^\\d+$") != null) {
      var dateinput = new Date(datetime);
      var current = new Date();
      if(dateinput < current) {
        $('.new-content-project #datetime').addClass('has-error');
      }else {
        var data = {
          master : $('.new-content-project input[name=master]').val(),
          master_id : $('.new-content-project input[name=master_id]').val(),
          date : datetime,
          title : title,
          pdo : content_pdo,
          spring : spring,
        }
        project.Addproject(data, tooltip);
      }
    }
  });

  $('#new-project').on('hide.bs.modal', function(){
    $('.new-content-project #title').removeClass('has-error');
    $('.new-content-project #datetime').removeClass('has-error');
    $('.new-content-project #pdo-project').removeClass('has-error');
    $('.new-content-project #spring').removeClass('has-error')
  });

});