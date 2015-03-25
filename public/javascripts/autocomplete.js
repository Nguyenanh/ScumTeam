$("#autocomplete").autocomplete({
  source: function(request, response){
    var list_user = [];
    $('#avatar_join li').each(function( index ) {
      list_user.push($( this ).data('join'));
    });
    var name = $('#autocomplete').val();
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/user/ajax_search",
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
  $.ajax({
    type : "POST",
    data : {user_id: user_id},
    url : 'http://localhost:3000/user/ajax_add_user',
    success : function(data) {
      $('#autocomplete').val('');
      if(data.avatar != null)
        $('#avatar_join').append('<li class="img-circle avatar_hear" data-join='+data.username+'><img class="size-image" src="/uploads/images/'+data.avatar+'"/></li>');
      else
        $('#avatar_join').append('<li class="img-circle avatar_hear" data-join='+data.username+'><label>'+data.firstname+'</label></li>');
    }
  });
});