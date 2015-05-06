$(document).ready(function(){
  var socketconnect = new SocketConnect();
  var socket = socketconnect.connect();
  var user_id = $('input[name=socket_user_id]').val();
  socket.on('remove_project_dashboard', function (project_id){
    $('.list-project .col-md-3').each(function (index) {
      if($(this).data('project') == project_id){
        $(this).remove();
      }
    });
  });
  $('.noti_toggle').on('show.bs.dropdown', function () {
    $.ajax({
      type: "POST",
      url: location.origin+"/notification/ajax_getall",
      data: {user_id: user_id},
      success :function(data){
        if(data.length != 0){
          $('.kanban-noti li').remove();
          for (var i = 0; i < data.length; i++) {
            var read = data[i].readed == 0 ? "none-read" : ""
            if(data[i].type.name = "Add project"){
              var tag = '<li class='+read+'><a href="/'+data[i].send_username+'">'+data[i].send_username+'</a><span>'+' '+data[i].message+'</span> '+data[i].type.project_name+'<span class="timeago-noti" data-livestamp="'+data[i].date+'"></span></li>'
              $('.kanban-noti').append(tag);
            }
          };
        }
      },
      complete :function(data){
        $('.noti_count span').css("display", "none");
      },
    });
    /*-------------------update read-----------------*/
  });
  socket.emit('get_all_notification',user_id);
  socket.on(user_id, function (count) {
    if(count == 0){
      $('.noti_count span').css("display", "none");
    }else{
      $('.noti_count span').text(count);
      $('.noti_count span').css("display", "block");     
    }
  });
});