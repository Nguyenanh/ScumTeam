$(document).ready(function() {
  var user_id = $('input[name=socket_user_id]').val();
  var project_master_id = $('#param_project input[name=master_project]').val();
  if(user_id != project_master_id){
    $('.remove-user-in-project').css("display", "none");
  }
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
  socket.on('list_people_online', function (list_user) {
    var list_user_online = Object.keys(list_user)
    $('#avatar_join li').each(function (index){
      if($.inArray($(this).data('join'), list_user_online) > -1)
        $(this).addClass('online');
      else
        $(this).removeClass('online');
    });
  });

  socket.on(project_id_req.project_id+user_id, function (data){
    if(data){
      location.replace(location.origin);
    }
  });

  socket.on(project_id_req.project_id+"_remove_user", function (data){
    $('#avatar_join .user-join').each(function (index) {
      if(data._id == $(this).find("li").data("id")){
        $(this).remove();
      }
    });
  });

  socket.on('create_new_note', function (data) {
    if(data.id_project == project_id_req.project_id){
      $('.column-first').append(data.note_content);
    }
  });

  socket.on(project_id_req.project_id+'_comment_socket', function (data) {
    $('#list-comment').append('<div class="comment-item"><img src="/uploads/images/'+data.user.avatar+'" style="width:30px; height:30px;" class="img-circle"><a href="/'+data.user.username+'"><label class="author">'+data.user.username+'</label></a><p class="content">'+data.content+'</p><span class="timeago" data-livestamp="'+data.created_at+'"></span></div>');
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
    var note_current = $(this);
    var project_id = project_id_req.project_id;
    var sprint_number = $('.project-run input[name=sprint_number]').val();
    var note_id = $(this).data('id');
    $('#note-detail-popup input[name=note_id_popup]').val($(this).data('id'));
    note.Detail($(this).data('id'));
    socket.on(project_id+sprint_number+note_id, function (data){
      $('#note_edit textarea').remove();
      $('#note_edit #save-rename-note').remove();
      $('#note_edit #cancel-rename-note').remove();
      $('#note_edit h4').remove();
      $('#note_edit').append('<h4 class="modal-title">'+data.content+'</h4>');
      note_current.find('p').html(data.content);
      /*------------------------*/
      $('#note_moscow_edit button').remove();
      $('#note_moscow_edit select').remove();
      $('#note_moscow_edit span').remove();
      $('#note_moscow_edit').append('<span class="point label label-primary">'+data.rate+'</span>');
      note_current.find('label:first').html(data.rate);
      
      /*----------------------------*/
      $('#note_point_edit button').remove();
      $('#note_point_edit select').remove();
      $('#note_point_edit span').remove();
      $('#note_point_edit').append('<span class="estimate label label-info">'+data.estimate+'</span>');
      note_current.find('label:last').html("-Point:"+data.estimate);

      /*-----------------------------*/
      $('#note_description_edit button').remove();
      $('#note_description_edit textarea').remove();
      $('#note_description_edit p').remove();
      $('#note_description_edit').append('<p>'+data.description+'</p>');
    });
  });
  /******* Rename Note*******/
  $('#note-detail-popup').on('click', '#rename_note', function() {
    $('#note_edit').removeClass("has-error");
    note_id = $('#note-detail-popup input[name=note_id_popup]').val();
    note_title = $('#note_edit h4').text();

    $('#note_edit textarea').remove();
    $('#note_edit #save-rename-note').remove();
    $('#note_edit #cancel-rename-note').remove();

    $('#note_edit').append('<textarea rows="3"class="form-control">'+note_title+'</textarea>');
    $('#note_edit').append('<button id="save-rename-note" class="btn btn-success">Save</button>');
    $('#note_edit').append('<button id="cancel-rename-note" class="btn btn-primary">Cancel</button>')
    $('#note_edit h4').css("display","none");

    $('#cancel-rename-note').click(function(){
      $('#note_edit').removeClass("has-error");
      $('#note_edit textarea').remove();
      $('#note_edit #save-rename-note').remove();
      $('#note_edit #cancel-rename-note').remove();
      $('#note_edit h4').css("display","block");
    });

    $('#save-rename-note').click(function(){
      var data_note = {
        project_id : project_id_req.project_id,
        project_sprint :$('.project-run input[name=sprint_number]').val(),
        note_id : note_id,
        note_title : $('#note_edit textarea').val(),
      }
      if(data_note.note_title == "") {
        $('#note_edit').addClass("has-error");
      }else {
        note.Update_title(data_note, socket);        
      }
    });
  });
  /**************Update moscow*****************/
  $('#note-detail-popup').on('click', '#update_moscow_note', function() {
    note_id = $('#note-detail-popup input[name=note_id_popup]').val();
    note_moscow = $('#note_moscow_edit').text();
    $('#note_moscow_edit button').remove();
    $('#note_moscow_edit select').remove();
    $('#note_moscow_edit').append('<select class="form-control"><option value="should">Should</option><option value="must">Must</option><option value="could">Could</option><option value="won\'t">Won\'t</option></select>');
    $('#note_moscow_edit').append('<button id="save-moscow-note" class="btn btn-success">Save</button>');
    $('#note_moscow_edit').append('<button id="cancel-moscow-note" class="btn btn-primary">Cancel</button>');
    $('#note_moscow_edit span').css("display","none");
    $('#cancel-moscow-note').click(function(){
      $('#note_moscow_edit button').remove();
      $('#note_moscow_edit select').remove();
      $('#note_moscow_edit span').css("display","block");
    });
    $('#save-moscow-note').click(function(){ 
      var data_note = {
        project_id : project_id_req.project_id,
        project_sprint :$('.project-run input[name=sprint_number]').val(),
        note_id : note_id,
        note_moscow : $('#note_moscow_edit select').val(),
      };
      note.Update_moscup(data_note, socket);
    });
  });
  /**************Update point*****************/
  $('#note-detail-popup').on('click', '#update_point_note', function() {
    var note_id = $('#note-detail-popup input[name=note_id_popup]').val();
    var note_point = $('#note_point_edit').text();
    $('#note_point_edit button').remove();
    $('#note_point_edit select').remove();
    $('#note_point_edit').append('<select class="form-control"><option value="1">1.0</option><option value="2">2.0</option><option value="3">3.0</option><option value="5">5.0</option><option value="8">8.0</option></select>');
    $('#note_point_edit').append('<button id="save-point-note" class="btn btn-success">Save</button>');
    $('#note_point_edit').append('<button id="cancel-point-note" class="btn btn-primary">Cancel</button>');
    $('#note_point_edit span').css("display","none");
    $('#cancel-point-note').click(function(){
      $('#note_point_edit button').remove();
      $('#note_point_edit select').remove();
      $('#note_point_edit span').css("display","block");
    });
    $('#save-point-note').click(function(){ 
      var data_note = {
        project_id : project_id_req.project_id,
        project_sprint :$('.project-run input[name=sprint_number]').val(),
        note_id : note_id,
        note_point : parseInt($('#note_point_edit select').val()),
      };
      note.Update_point(data_note, socket);
    });
  });
  /*--------------------------------------------------------*/
  $('#note-detail-popup').on('click', '#update_description_note', function() {
    $('#note_description_edit textarea').remove();
    $('#note_description_edit button').remove();
    $('#note_description_edit').removeClass("has-error");
    var note_id = $('#note-detail-popup input[name=note_id_popup]').val();
    var note_description = $('#note_description_edit p').text();

    $('#note_description_edit').append('<textarea rows="3" class="form-control">'+note_description+'</textarea>');
    $('#note_description_edit').append('<button id="save-description-note" class="btn btn-success">Save</button>');
    $('#note_description_edit').append('<button id="cancel-description-note" class="btn btn-primary">Cancel</button>');
    $('#note_description_edit p').css("display", "none");
    $('#cancel-description-note'). click(function(){
      $('#note_description_edit textarea').remove();
      $('#note_description_edit button').remove();  
      $('#note_description_edit p').css("display", "block"); 
    });
    $('#save-description-note').click(function(){
      var data_note = {
        project_id : project_id_req.project_id,
        project_sprint :$('.project-run input[name=sprint_number]').val(),
        note_id : note_id,
        note_description : $('#note_description_edit textarea').val(),
      };
      if(data_note.note_description == ""){
        $('#note_description_edit').addClass("has-error");
      }else{
        note.update_description(data_note, socket);
      }
    });

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

});