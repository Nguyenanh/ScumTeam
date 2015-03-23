$("#autocomplete").autocomplete({
  source: function(request, response){
    var name = $('#autocomplete').val();
    console.log(name);
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/user/ajax_search",
      data: {username: name},
      // contentType: "application/json; charset=utf-8",
      // dataType: "json",
      success: function (msg) {
        console.log(msg);
        // response($.parseJSON(msg.d).Records);
      },
      error: function (msg) {
         alert(msg.status + ' ' + msg.statusText);
      }
    });
   },
   // select: function (event, ui) {
   //     $("#WorkItem").val(ui.item.Work_Item);
   //     return false;
   // }
});
// .data("autocomplete")._renderItem = function (ul, item) {
//     return $("<li></li>")
//     .data("item.autocomplete", item)
//     .append("<a>" + item.Work_Item + "</a>")
//     .appendTo(ul);
// };