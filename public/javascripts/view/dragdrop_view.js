$(document).ready(function(){
  var dragdrop = new Dragdrop();
  var socketconnect = new SocketConnect();
  var socket = socketconnect.connect();
  var project_id = $('#form-autocomplete #project_id').val();
  var user_id = $('body input[name=socket_user_id]').val();
  socket.on('dragdrop_note', function (data){
    if(project_id == data.project_id) {
      $('.column').each(function (index){
        //New Note
        if($(this).data('column') == data.column_new) {
          $(this).find('li').remove();
          for(var i = 0; i < data.note_news.length; i++) {
            if(data.note_news[i].assign == "t") {
              if(data.note_news[i].user.user_id == user_id) {
                var disable_class = "";
              }else {
                var disable_class = "unsortable";
              }
              $(this).find('ul').append('<li data-id="'+data.note_news[i]._id+'" data-owner="'+data.note_news[i].owner+'" id="note_detail" class="'+disable_class +' sortable-item ui-sortable-handle"><p>'+data.note_news[i].content+'</p><label>'+data.note_news[i].rate+'Point-</label><label>'+data.note_news[i].estimate+'</label><i class="glyphicon glyphicon-time"></i><p id="assign"><img src="/uploads/images/'+data.note_news[i].user.avatar+'" style="width:20px; height:20px;" class="img-circle"><label>'+data.note_news[i].user.username+'</label></p></li>');
            }
            else
              $(this).find('ul').append('<li data-id="'+data.note_news[i]._id+'" data-owner="'+data.note_news[i].owner+'" id="note_detail" class="sortable-item ui-sortable-handle"><p>'+data.note_news[i].content+'</p><label>'+data.note_news[i].rate+'Point-</label><label>'+data.note_news[i].estimate+'</label><i class="glyphicon glyphicon-time"></i></li>');
          };
        };
        //Old Note
        if($(this).data('column') == data.column_old) {
          $(this).find('li').remove();
          for(var i = 0; i < data.note_olds.length; i++) {
            if(data.note_olds[i].assign == "t") {
              if(data.note_olds[i].user.user_id == user_id) {
                var disable_class = "";
              }else {
                var disable_class = "unsortable";
              }
              $(this).find('ul').append('<li data-id="'+data.note_olds[i]._id+'" data-owner="'+data.note_olds[i].owner+'" id="note_detail" class="'+ disable_class +' sortable-item ui-sortable-handle"><p>'+data.note_olds[i].content+'</p><label>'+data.note_olds[i].rate+'Point-</label><label>'+data.note_olds[i].estimate+'</label><i class="glyphicon glyphicon-time"></i><p id="assign"><img src="/uploads/images/'+data.note_olds[i].user.avatar+'" style="width:20px; height:20px;" class="img-circle"><label>'+data.note_olds[i].user.username+'</label></p></li>');
            }
            else
              $(this).find('ul').append('<li data-id="'+data.note_olds[i]._id+'" data-owner="'+data.note_olds[i].owner+'" id="note_detail" class="sortable-item ui-sortable-handle"><p>'+data.note_olds[i].content+'</p><label>'+data.note_olds[i].rate+'Point-</label><label>'+data.note_olds[i].estimate+'</label><i class="glyphicon glyphicon-time"></i></li>');
          };
        };
      });
    }
  });

  $('#example-1-3 .sortable-list').sortable({
    connectWith: '#example-1-3 .sortable-list',
    placeholder: 'placeholder',
     items: "li:not(.unsortable)",
    receive: function( event, ui ) {
      var column_number = parseInt($(this).data('column'));
      if(column_number == 1) 
      {
        var data_note = {
          project_id : $('#form-autocomplete #project_id').val(),
          column : parseInt($(this).data('column')),
          note_id : $(ui.item).data('id'),
          assign: "f",
          user: null,
          owner: 0,
          sprint_number: parseInt($('.project-run input[name=sprint_number]').val()),
        };
        dragdrop.move_assign(data_note, socket);
      }
      else
      {
        var user_info = {
          user_id : $('body input[name=socket_user_id]').val(),
          avatar : $('body input[name=socket_user_avatar]').val(),
          username : $('body input[name=socket_user_username]').val(),
        };
        var data_note = {
          project_id : $('#form-autocomplete #project_id').val(),
          column : parseInt($(this).data('column')),
          note_id : $(ui.item).data('id'),
          user : user_info,
          assign: "t",
          owner: $(ui.item).data('owner'),
          sprint_number: parseInt($('.project-run input[name=sprint_number]').val()),
        };
        dragdrop.move_assign(data_note, socket);
      }
    },
    remove: function( event, ui ) {

      column = parseInt($(this).data('column'));
      var data_chart = {
        project_id : project_id,
        column: column,
        sprint_number : parseInt($('.project-run input[name=sprint_number]').val()),
      }
      socket.emit('dragdrop_note_old', column);
      if(column == 4) {
        console.log(data_chart);
        socket.emit('caculate_chart', data_chart);       
      }
    },
  }).disableSelection();   

});
