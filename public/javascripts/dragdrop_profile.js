$(document).ready(function(){
  $('#example-1-3 .sortable-list').sortable({
    connectWith: '#example-1-3 .sortable-list',
    placeholder: 'placeholder',
    receive: function( event, ui ) {
      var data = {
        column : parseInt($(this).data('column')),
        note_id : $(ui.item).data('id')
      } ;
      console.log(data);
      $.ajax({
        type: "POST",
        url: "http://localhost:3000/note/ajax_update",
        data: {datanote : data},
        success: function(data) {
          console.log(data);
        }
      });
    },
  }).disableSelection();   

});
