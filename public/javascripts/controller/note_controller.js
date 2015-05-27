function Note() {

}
Note.prototype.Addnote = function(note, socket) {
  $.ajax({
    type: 'POST',
    data: {data: note},
    url: location.origin+'/note/ajaxnewnote',  
    success:function(data){
      $('#new-note-form textarea').val('');
      $('#new-note-form input[name=estimate]').val('');
      var send_data = {
        note_content : '<li data-id="'+data[0]._id+'" data-owner="'+data[0].owner+'" id="note_detail" class="sortable-item"><p>'+data[0].content+'</p><label>'+data[0].rate+'Point:'+data[0].estimate+'</label></li>',
        id_project :$('input[name=idproject]').val(),
      }
      var data_chart = {
        project_id : note.id,
        sprint_number : note.sprint_number,
      }
      socket.emit('caculate_chart', data_chart);
      socket.emit('create_new_note', send_data);
      $('#new-note-form').modal('hide');
    }
  });/*******end if ***/
}
Note.prototype.Removenote = function(note_id, note_current) {
  $.ajax({
    type: "POST",
    data: {note_id: note_id},
    url: location.origin+"/note/ajax_delete",
    success: function(data) {
      if(data) {
        $('#remove-note-form').modal('hide');
        note_current.remove();
      }
    }
  });
}
Note.prototype.Detail = function(note_id) {
  $.ajax({
    type: "POST",
    data: {note_id: note_id},
    url: location.origin+"/note/ajax_node_detail",
    success: function(data) {
      $('#note-detail-popup .modal-title').text(data.note.content);
      $('#note-detail-popup .point').text(data.note.rate);
      $('#note-detail-popup .estimate').text(data.note.estimate);
      if(data.note.user != null) {
        $('#note-detail-popup .assige').remove();
        $('#note-detail-popup #note_assign_edit').append('<span class="assige label label-warning">'+data.note.user.username+'</span>');
      }
      $('#note-detail-popup .description').text(data.note.description);
      if(data.comments != "") {
        $('#list-comment .comment-item').remove();
        for (var i = 0; i<data.comments.length; i++) {
          $('#list-comment').append('<div class="comment-item"><img src="'+data.comments[i].user.avatar+'" style="width:30px; height:30px;" class="img-circle"><a href="/'+data.comments[i].user.user_id+'"><label class="author">'+data.comments[i].user.username+'</label></a><p class="content">'+data.comments[i].content+'</p><span class="timeago" data-livestamp="'+data.comments[i].created_at+'"></span></div>');
          // $('#list-comment .comment-item').append('<p class="timeago-comment">'+$.timeago(new Date(data.comments[i].created_at))+'</p>');
        };
      }
      $('#note-detail-popup').modal('show');
    }
  });
}
Note.prototype.get_note_done = function(data_chart, callback) {
  $.ajax({
    type: "POST",
    data: {data : data_chart},
    url : location.origin+"/note/ajax_get_note_done",
    success : function(data) {
     callback(data);
    }
  });
}

Note.prototype.Update_title = function(data_note, socket) {
  socket.emit('update_title_note', data_note);
}
Note.prototype.Update_moscup = function(data_note, socket) {
  socket.emit('update_moscow_note', data_note);
}
Note.prototype.Update_point = function(data_note, socket) {
  socket.emit('update_point_note', data_note);
}
Note.prototype.update_description = function(data_note, socket) {
  socket.emit('update_description_note', data_note)
}