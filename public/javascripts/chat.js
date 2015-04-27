$(document).ready(function() {
  var messages = [];
  var socket = io.connect(location.origin);
  var field = $(".field");
  var sendButton = $(".send");
  var content = $("#content");

  socket.on('message', function (data) {
      if(data.message) {
          messages.push(data.message);
          var html = '';
          for(var i=0; i<messages.length; i++) {
              html += messages[i] + '<br />';
          }
          content.html(html);
      } else {
          console.log("There is a problem:", data);
      }
  });

  sendButton.click(function() {
      var text = field.val();
      socket.emit('send', { message: text });
      field.val("");
  });
  field.keypress(function(e){
    if(e.which == 13){//Enter key pressed
      sendButton.click();//Trigger search button click event
    }
  });
});