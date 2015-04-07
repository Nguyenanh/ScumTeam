$(document).ready(function() {
  var profile = new Profile();
  var close_alert = new Alert();
  close_alert.show();
  
  $('#update-profile-detail').click(function(e){
    var data = {};
    data.username = $('#form-register input[name=username]').val();
    data.firstname = $('#form-register input[name=firstname]').val();
    data.lastname = $('#form-register input[name=lastname]').val();
    data.id = $('#form-register input[name=id]').val();
    profile.Update_detail(data, close_alert);
  });

  $('#description').on('click','#update-profile-des', function(e){
    profile.description = $('#description p').text();
    profile.Add_description();
  });

  $('#description').on('click','#cancel-profile-des', function(e){
    profile.Remove_description();
  });

  $('#description').on('click','#save-profile-des', function(e){
    var data = {};
    data.description = $('#description .content').val();
    data.id = $('#form-register input[name=id]').val();
    profile.Update_description(data);
  });
  
  profile.Update_password(close_alert);
});