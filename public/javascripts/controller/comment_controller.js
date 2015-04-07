function Comment() {

}
Comment.prototype.add_comment = function(new_comment, socket, project_id) {
  var data = {
    comment : new_comment,
    project_id : project_id,
  }
  $('#form_comment input[name=comment]').val("");
  socket.emit('comment_socket', data);
}