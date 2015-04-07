function Project() {
}
Project.prototype.Addproject = function(data, alert, tooltip) {
    $.ajax({
    type: 'POST',
    data: {dataproject : data},
    url: location.origin+'/project/new',
    success: function(data) {
      if(data.status) {
        $('#new-project').modal('hide');
        $('#message').append('<div class="alert notice alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> <strong>Success!</strong>'+data.masseges +'</div>');
        alert.show();
        $('.list-project').append('<div class="col-md-3"><a href="/project/'+ data.project._id+'" class="back-ground-red" data-toggle="tooltip" title="'+data.user.firstname+'"><span>'+data.project.title+'</span><label class="status-project img-circle">'+data.project.status+'</label></a></div>');
        tooltip.show();
      }
    }
  });
}