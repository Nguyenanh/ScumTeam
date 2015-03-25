module.exports = function(io, socket){
console.log('user connection');
socket.emit('message', { message: 'welcome to the chat' });
socket.on('send', function (data) {
    io.sockets.emit('message', data);
  });
}