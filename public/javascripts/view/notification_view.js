$(document).ready(function(){
  var socketconnect = new SocketConnect()
  var socket = socketconnect.connect();
  var user_id = $('input[name=socket_user_id]').val();
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