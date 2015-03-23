$(document).ready(function() {
  $('#new-project').on('click', '#save-new-project', function(){
    var title = $('#title input').val();
    var datetime = $('#datetime input').val();
    if(title == "") {
      $('.new-content-project #title').addClass('has-error');
    }
    if(datetime =="") {
      $('.new-content-project #datetime').addClass('has-error');
    }
    if(title != "" && datetime !="") {
      var dateinput = new Date(datetime);
      var current = new Date();
      if(dateinput < current) {
        $('.new-content-project #datetime').addClass('has-error');
      }else {
        var data = {
          id : $('.new-content-project input[name=id]').val(),
          date : $('.new-content-project input[name=date]').val(),
          title : $('.new-content-project input[name=title]').val()
        }
        $.ajax({
          type: 'POST',
          data: {dataproject : data},
          url: 'http://localhost:3000/project/new',
          success: function(data) {
            if(data.status) {
              $('#new-project').modal('hide');
              $('#message').append('<div class="alert notice alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> <strong>Success!</strong>'+data.masseges +'</div>');
              close_alert();
              $('.list-project').append('<div class="col-md-3"><a href="#" data-toggle="tooltip" title="'+ data.user.firstname+'"><span>'+data.project.title+'</span><label class="status-project img-circle">'+data.project.status+'</label></a></div>');
            }
          }
        });
      }

    }
  });

  $('#new-project').on('click', '.close', function(){
    $('.new-content-project #title').removeClass('has-error');
    $('.new-content-project #datetime').removeClass('has-error');
  });

});