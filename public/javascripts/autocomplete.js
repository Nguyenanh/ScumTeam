$(document).ready(function() {
  var socketconnect = new SocketConnect()
  var socket = socketconnect.connect();
  var notification = new Notification();
  var tooltip = new Tooltip();
  var project_id = $('input[name=idproject]').val();
  var user_id_current = $('input[name=socket_user_id]').val();
  var user_name_current = $('input[name=socket_user_username]').val();
  var project_master_id = $('#param_project input[name=master_project]').val();
$("#autocomplete").autocomplete({
  source: function(request, response){
    var list_user = [];
    $('#avatar_join li').each(function( index ) {
      list_user.push($( this ).data('join'));
    });
    var name = $('#autocomplete').val();
    $.ajax({
      type: "POST",
      url: location.origin+"/user/ajax_search",
      data: {username: name, list_user: list_user},
      success: function (msg) {
        response(msg);
      },
      error: function (msg) {
         alert(msg.status + ' ' + msg.statusText);
      }
    });
   },
  focus: function( event, ui ) {
    $("#autocomplete").val(ui.item.username);
    $("#user_id").val(ui.item._id);
    return false;
  },
  select: function( event, ui ) {
    $( "#autocomplete" ).val( ui.item.username );
    return false;
  }
})
.autocomplete( "instance" )._renderItem = function( ul, item ) {      
  return $("<li>")
        .append("<a>"+item.firstname+"("+item.username+")</a>" )
        .appendTo(ul);
    };
/************Add user in projec************/
  $('#add_user_project').click(function(){
    var username = $( "#autocomplete" ).val();
    if(username != "") {
      var user_id = $(this).closest('#form-autocomplete').find('#user_id').val();
      var project_id = $(this).closest('#form-autocomplete').find('#project_id').val();
      var data = {
        user_id: user_id,
        project_id: project_id,
      }
      $.ajax({
        type : "POST",
        data : {data: data},
        url : location.origin+'/user/ajax_add_user',
        success : function(data) {
          $('#autocomplete').val('');
          if(user_id_current==project_master_id){
            $('#avatar_join').append('<div class="user-join"><li class="img-circle avatar_hear" data-join='+data.username+' data-id="'+data._id+'"><img class="size-image" src="/uploads/images/'+data.avatar+'" style="width:50px; height:50px;"/></li><span class="firstname-master">'+data.firstname+'</span><a data-toggle="confirmation" data-singleton="true" data-popout="true" class="remove-user-in-project"><i class="glyphicon glyphicon-remove"></i></a></div>');
            $('.remove-user-in-project').confirmation({
              onConfirm: function() {
                var data_user = {
                  user_id : $(this).closest('.user-join').find("li").data("id"),
                  project_id :project_id,
                }
                socket.emit("remove_user_in_project", data_user);
                var data_noti = {
                  recent_id : data_user.user_id,
                };
                notification.add_noti(data_noti, socket);
              }
            });
          }else{
            $('#avatar_join').append('<div class="user-join"><li class="img-circle avatar_hear" data-join='+data.username+' data-id="'+data._id+'"><img class="size-image" src="/uploads/images/'+data.avatar+'" style="width:50px; height:50px;"/></li><span class="firstname-master">'+data.firstname+'</span></div>');
          }
          socket.emit('new_project_room', project_id);

          var data_noti = {
            type : "Project",
            id : project_id,
            recent : username,
            send : user_name_current,
            recent_id : user_id,
          };
          notification.add_noti(data_noti, socket)
        }
      });
    }
  });
  /*---------------------------------------*/
  $('.remove-user-in-project').confirmation({
    onConfirm: function() {
      var data_user = {
        user_id : $(this).closest('.user-join').find("li").data("id"),
        project_id :project_id,
      }
      socket.emit("remove_user_in_project", data_user);
      var data_noti = {
        recent_id : data_user.user_id,
      };
      notification.add_noti(data_noti, socket);
    },
  });
});