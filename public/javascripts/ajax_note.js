$(document).ready(function() {
  /******************New Note*******************/
  $('#save-note').click(function(){
    var content_note = $('#note-content textarea').val();
    console.log(content_note);
    if (content_note !== ""){
      var note ={
        content: $('#note-content textarea').val(),
        rate: $('#note-rate').val(),
        estimate: $('input[name=estimate]').val(),
        id: $('input[name=idproject]').val(),
      }
      $.ajax({
        type: 'POST',
        data: {data: note},
        url: 'http://localhost:3000/note/ajaxnewnote',  
        success:function(data){
          $('#new-note-form textarea').text();
          $('#new-note-form input[name=estimate]').text();
          var rate='';
          var ratenull='';
          for (var i = 1; i <= parseInt(data[0].rate); i++) {
            rate = rate + '<i class="glyphicon glyphicon-star"></i>'
          };
          for (var i = 1; i <= 5-parseInt(data[0].rate); i++) {
            ratenull = ratenull + '<i class="glyphicon glyphicon-star-empty"></i>'
          };
          $('.column-first').append('<li class="sortable-item"><p>'+data[0].content+'</p>'+rate+ratenull+'</li>');
          console.log(data)
          $('#new-note-form').hide();
        }
      });/*******end if ***/
    }
  });
  /******************End New Note***************/
  /******************Remove Note****************/
  $('.sortable-list .note-remove').click(function(){
    $('#remove-note-form').modal('show');
    var note_current = $(this).closest('.sortable-item');
    var note_id =$(this).closest('.sortable-item').data('id');
    $('#save-remove-note').click(function(){
      console.log(note_id);
      $.ajax({
        type: "POST",
        data: {note_id: note_id},
        url: "http://localhost:3000/note/ajax_delete",
        success: function(data) {
          if(data) {
            $('#remove-note-form').modal('hide');
            note_current.remove();
          }
        }
      });
    })
  });
});