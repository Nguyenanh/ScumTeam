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
        column: data.column,
        sprint_number : data_note.sprint_number,
      }
      socket.emit('dragdrop_note', column);
      if(data.column  == 4 ) {
        socket.emit('caculate_chart', column);
      }
    }
  });
};
