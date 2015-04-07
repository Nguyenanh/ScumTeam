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
        note_content : '<li data-id="'+data[0]._id+'" data-owner="'+data[0].owner+'" id="note_detail" class="sortable-item"><p>'+data[0].content+'</p><label>'+data[0].rate+'Point-'+data[0].estimate+'</label><i class="glyphicon glyphicon-time"></i></li>',
        id_project :$('input[name=idproject]').val(),
      }
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
      $('#note-detail-popup .point').text(data.note.rate+" Point");
      $('#note-detail-popup .estimate').text(data.note.estimate);
      $('#note-detail-popup .estimate').append('<i class="glyphicon glyphicon-time"></i>');
      if(data.note.user != null) {
        $('#note-detail-popup .assige').remove();
        $('#note-detail-popup .modal-header').append('<span class="assige label label-warning">'+data.note.user.username+'</span>');
      }
      if(data.comments != "") {
        $('#list-comment .comment-item').remove();
        for (var i = 0; i<data.comments.length; i++) {
          $('#list-comment').append('<div class="comment-item"><img src="/uploads/images/'+data.comments[i].user.avatar+'" style="width:30px; height:30px;" class="img-circle"><a href="/'+data.comments[i].user.username+'"><label class="author">'+data.comments[i].user.username+'</label></a><p class="content">'+data.comments[i].content+'</p></div>');
        };
      }
      $('#note-detail-popup').modal('show');
    }
  });
}