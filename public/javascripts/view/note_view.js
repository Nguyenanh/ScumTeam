$(document).ready(function() {
  var note = new Note();
  var comment = new Comment();
  var socketconnect = new SocketConnect()
  var socket = socketconnect.connect();
  var project_id_req = {
    project_id : $('input[name=idproject]').val()
  }

  var socketconnect = new SocketConnect();
  var socket = socketconnect.connect();

  socket.on('people_status', function (list_user){
    $('#avatar_join li').each(function (index){
      if($.inArray($(this).data('join'), list_user) > -1)
        $(this).addClass('online');
      else
        $(this).removeClass('online');
    })
  });

  socket.on('create_new_note', function (data) {
    if(data.id_project == project_id_req.project_id){
      $('.column-first').append(data.note_content);
    }
  });

  socket.on(project_id_req.project_id+'_comment_socket', function (data) {
    $('#list-comment').append('<div class="comment-item"><img src="/uploads/images/'+data.user.avatar+'" style="width:30px; height:30px;" class="img-circle"><a href="http://localhost:3000/'+data.user.username+'"><label class="author">'+data.user.username+'</label></a><p class="content">'+data.content+'</p></div>');
  });
  /******************New Note*******************/
  $('#ex-1-3').on('click','#save-note', function(){
    var content_note = $('#note-content textarea').val();
    if (content_note !== ""){
      var data ={
        content: $('#note-content textarea').val(),
        rate: $('input[name=point]').val(),
        estimate: $('input[name=estimate]').val(),
        id: $('input[name=idproject]').val(),
      };
      note.Addnote(data, socket);
    }
  });
  /******************End New Note***************/
  /******************Remove Note****************/
  $('.sortable-list .note-remove').click(function(){
    $('#remove-note-form').modal('show');
    var note_current = $(this).closest('.sortable-item');
    var note_id =$(this).closest('.sortable-item').data('id');
    $('#save-remove-note').click(function(){
      note.Removenote(note_id, note_current);
    })
  });

  $('#ex-1-3').on('click', '#note_detail', function() {
    $('#note-detail-popup input[name=note_id_popup]').val($(this).data('id'));
    note.Detail($(this).data('id'));
  });

  $('#note-detail-popup').on('click', '#add-new-comment', function() {
    var user_info = {
          user_id : $('body input[name=socket_user_id]').val(),
          avatar : $('body input[name=socket_user_avatar]').val(),
          username : $('body input[name=socket_user_username]').val(),
        };
    var new_comment = {
      note_id : $('#note-detail-popup input[name=note_id_popup]').val(),
      content : $('#form_comment input[name=comment]').val(),
      user : user_info,
    }
    if(new_comment.content != "")
      comment.add_comment(new_comment, socket, project_id_req.project_id);
  });
});