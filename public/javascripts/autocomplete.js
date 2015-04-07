$(document).ready(function() {
  var socketconnect = new SocketConnect()
  var socket = socketconnect.connect();
  var tooltip = new Tooltip();
  var project_id = $('input[name=idproject]').val();

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
        $('#avatar_join').append('<li class="img-circle avatar_hear" data-join='+data.username+'><img class="size-image" src="/uploads/images/'+data.avatar+'" style="width:50px; height:50px;"/></li>');
        socket.emit('new_project_room', project_id);
      }
    });
  });
});