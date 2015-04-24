$(document).ready(function() {
  var parseHtml = $('#content-pdo-html').text();
  $('#content-pdo-html').text("");
  $('#content-pdo-html').append(parseHtml);
  var note = new Note();
  var user_story_chart = new UserStory();
  var comment = new Comment();
  var socketconnect = new SocketConnect()
  var socket = socketconnect.connect();
  var project = new Project();
  var project_id_req = {
    project_id : $('input[name=idproject]').val()
  }
  var project_sprint_current = parseInt($('.project-run input[name=count_sprint_project]').val());
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
    $('#list-comment').append('<div class="comment-item"><img src="/uploads/images/'+data.user.avatar+'" style="width:30px; height:30px;" class="img-circle"><a href="/'+data.user.username+'"><label class="author">'+data.user.username+'</label></a><p class="content">'+data.content+'</p></div>');
  });

  socket.on(project_id_req.project_id+'_edit_project', function (data) {
    window.location.reload();
  });
  /******************New Note*******************/
  $('#new-note-form').on('hide.bs.modal', function() {
    $('#note-content').removeClass('has-error');
  });
  $('#new-note-form').on('click','#save-note', function(){

    var content_note = $('#note-content textarea').val();
    if (content_note !== ""){
      var data ={
        content: $('#note-content textarea').val(),
        rate: $('#note-rate').val(),
        estimate: parseInt($('#note-point').val()),
        id: $('input[name=idproject]').val(),
        sprint_number : $('.project-run input[name=sprint_number]').val(),
      };
      note.Addnote(data, socket);
    }else{
      $('#note-content').addClass('has-error');
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
      content : $('#form_comment textarea').val(),
      user : user_info,
    }
    if(new_comment.content != "")
      comment.add_comment(new_comment, socket, project_id_req.project_id);
  });

  $('#rename-project').on('show.bs.modal', function() {
    $('#rename-project input[name=title]').val($('.run-title-project').text());
    $('#rename-project input[name=sprint]').val($('.project-run input[name=count_sprint_project]').val());
  });

  $('#rename-project').on('hide.bs.modal', function() {
    $('#rename-project-title').removeClass('has-error');
    $('#rename-project-sprint').removeClass('has-error');
    $('#rename-project-sprint').removeClass('has-error');
    $('#rename-project-date-sprint').removeClass('has-error');
  });


  $('#rename-project').on('click', '#save-rename-project', function() { 
    var data = {
      project_name : $('#rename-project input[name=title]').val(),
      project_id : project_id_req.project_id,
      project_sprint :$('#rename-project input[name=sprint]').val(),
      project_deadline :$('#rename-project input[name=deadline]').val(),
      project_content : $('#rename-project #pdo-textarea').text(),
    };
    if(data.project_name == "") {
      $('#rename-project-title').addClass('has-error');
    }else if(data.project_sprint == "") {
      $('#rename-project-sprint').addClass('has-error');
    }else if(data.project_content == "") {
      $('#rename-project-sprint').addClass('has-error');
    }else {
      if(parseInt(data.project_sprint)!= project_sprint_current){
        if(data.project_deadline == "") {
          $('#rename-project-date-sprint').addClass('has-error');
        }else {
          project.Editproject(data, socket);
          $('#rename-project').modal('hide');
        }
      }else {
        project.Editproject(data, socket);
        $('#rename-project').modal('hide');
      }
    }
  });

  // $('#change-date-note').on('click', '.save', function() {
  //   var data = {
  //     project_deadline : $('#change-date-note input[name=deadline]').val(),
  //     project_id : project_id_req.project_id,
  //   };
  //   var timecurrent = new Date();
  //   var dateinput = new Date(data.project_deadline);
  //   if(dateinput >= timecurrent) {
  //     $('#change-date-note').modal('hide');
  //     project.Changedeadlineproject(data, socket);
  //   }
  //   else {
  //     $('#change-date-note .col-md-12').addClass('has-error');
  //   }
  // });

  // $('#change-date-note').on('hide.bs.modal', function() {
  //   $('#change-date-note .col-md-12').removeClass('has-error');
  // });


  // $('#change-spring-note').on('click', '.save', function() {
  //   var data = {
  //     project_spring: $('#change-spring-note input[name=spring]').val(),
  //     project_id : project_id_req.project_id,
  //   };

  //   if(data.project_spring.match("^\\d+$") != null) {
  //     $('#change-spring-note').modal('hide');
  //     project.Changespringproject(data, socket);
  //   }
  //   else {
  //     $('#change-spring-note .col-md-12').addClass('has-error');
  //   }
  // });

  // $('#change-spring-note').on('hide.bs.modal', function() {
  //   $('#change-spring-note .col-md-12').removeClass('has-error');
  // });

});