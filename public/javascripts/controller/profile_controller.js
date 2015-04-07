function Profile() {
}
Profile.prototype.Update_detail = function(data, close_alert) {
    $.ajax({
    type: 'POST',
    data: {dataob: data},
    url: location.origin+'/user/ajaxdetail',           
    success: function(data) {
        if (data.status){
          $('#message .notice').remove();
          $('#message').append('<div class="alert notice alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> <strong>Success!</strong>'+data.massege +'</div>');
          $('#form-register input[name=firstname]').val(data.resUser.firstname);
          $('#form-register input[name=lastname]').val(data.resUser.lastname);        
          $('#menu-head #menu-info').html(data.resUser.firstname+ " "+data.resUser.lastname);
          $('#menu-head #menu-info').append('<span class="caret"></span>');
          if(data.resUser.avatar == null) {
            $('.user-profile .avatar').html(data.resUser.firstname);
            $('#menu-head .avatar_hear label').html(data.resUser.firstname);
          }
          close_alert.show();
        }
        else{
          $('#message .notice').remove();
          $('#message').append('<div class="alert notice alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> <strong>Error!</strong>'+data.massege +'</div>');
        }
    }
  });
}
Profile.prototype.Update_description = function(data, close_alert) {
  $.ajax({
    type: 'POST',
    data: {dataob: data},
    url: location.origin+'/user/ajaxdesc',           
    success: function(data) {
      if (data.status){
        $('#message .notice').remove();
        $('#message').append('<div class="alert notice alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> <strong>Success!</strong>'+data.massege +'</div>');
        $('#description h1 a').remove();
      $('#description .content').remove();
      $('#description p').remove();
      $('#description h1').append('<a class="btn btn-warning" id="update-profile-des">Edit</a>');
      $('#description').append('<p>'+data.resUser.description+'</p>');
      close_alert.show();
      }
    }
  });
}

Profile.prototype.Add_description = function() {
  $('#description p').remove();
  $('#description').append('<textarea class="form-control content" rows="3"></textarea>');
  $('#description .content').val(this.description);
  $('#description a').remove();
  $('#description h1').append('<a id="save-profile-des" class="btn btn btn-primary">Save</a>');
  $('#description h1').append('<a id="cancel-profile-des" class="btn btn btn-danger">Cancel</a>');
}

Profile.prototype.Remove_description = function() {
  $('#description h1 a').remove();
  $('#description .content').remove();
  $('#description p').remove();
  $('#description h1').append('<a class="btn btn-warning" id="update-profile-des">Edit</a>');
  $('#description').append('<p>'+this.description+'</p>');
}
Profile.prototype.Update_password = function(close_alert) {
  $('form#uploadForm').change(function(){
    $(this).ajaxSubmit({
        error: function(xhr) {
            status('Error: ' + xhr.status);
        },
        success: function(data) {
          console.log(data);
          $('#message .notice').remove();
          $('#message').append('<div class="alert notice alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> <strong>Success!</strong>'+ data.massege +'</div>');
            close_alert.show();
          $('.user-profile .after-upload label').remove();
          $('.user-profile .after-upload img').remove();
          $('.user-profile .avatar').append('<img src="/uploads/images/'+data.resUser.avatar+'" style="width:250px; height:250px;" class="img-responsive">');


          $('#menu-head .avatar_hear label').remove();
          $('#menu-head .avatar_hear img').remove();
          $('#menu-head .avatar_hear').append('<img src="/uploads/images/'+data.resUser.avatar+'" style="width:50px; height:50px;" class="size-image">')
        }
    });
  });
}
