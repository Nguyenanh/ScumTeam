function Dragdrop() {

};
Dragdrop.prototype.move_assign = function(data_note, socket) {
  $.ajax({
    type: "POST",
    url: location.origin+"/note/ajax_update",
    data: {datanote : data_note},
    success: function(data) {
      var column = {
        project_id : data_note.project_id,
        column: data.column
      }
      socket.emit('dragdrop_note', column);
    }
  });
};
