var projects = [
      {
        value: "jquery",
        label: "jQuery",
        desc: "the write less, do more, JavaScript library",
        icon: "jquery_32x32.png"
      },
      {
        value: "jquery-ui",
        label: "jQuery UI",
        desc: "the official user interface library for jQuery",
        icon: "jqueryui_32x32.png"
      },
      {
        value: "sizzlejs",
        label: "Sizzle JS",
        desc: "a pure-JavaScript CSS selector engine",
        icon: "sizzlejs_32x32.png"
      }
    ];
$("#autocomplete").autocomplete({
  // source: projects,
  source: function(request, response){
    var name = $('#autocomplete').val();
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/user/ajax_search",
      data: {username: name},
      success: function (msg) {
        // console.log(JSON.stringify(msg));
        // response(JSON.stringify(msg));
        response(msg);
      },
      error: function (msg) {
         alert(msg.status + ' ' + msg.statusText);
      }
    });
   },
  focus: function( event, ui ) {
    $( "#autocomplete" ).val( ui.item.username  );
    return false;
  },
  select: function( event, ui ) {
    $( "#autocomplete" ).val( ui.item.username );
    $( "#user_id" ).val( ui.item._id  );
    $( "#user_username" ).html( ui.item.desc );
    return false;
  }
})
.autocomplete( "instance" )._renderItem = function( ul, item ) {      
  return $("<li>")
        .append("<a>"+item.firstname+"("+item.username+")</a>" )
        .appendTo(ul);
    };