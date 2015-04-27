function Notification() {

}
Notification.prototype.add_noti = function(data_noti, socket) {
  socket.emit("notification", data_noti);
}