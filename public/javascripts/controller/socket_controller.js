function SocketConnect() {

}
SocketConnect.prototype.connect = function() {
  return io.connect(location.origin);
}