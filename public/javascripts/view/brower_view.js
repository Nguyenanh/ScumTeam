$(document).ready(function() {
  var socketconnect = new SocketConnect()
  var socket = socketconnect.connect();
  var user_name = $('input[name=socket_user_username]').val();
  socket.emit('list_people_status', user_name);
});
