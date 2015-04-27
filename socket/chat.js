module.exports = function(io, socket){
socket.emit('message', { message: 'welcome to the chat' });
socket.on('send', function (data) {
  console.log(data);
    io.sockets.emit('message', data);
  });
}