function Project() {
}
Project.prototype.Addproject = function(data, tooltip) {
    $.ajax({
    type: 'POST',
    data: {dataproject : data},
    url: location.origin+'/project/new',
    success: function(data) {
      if(data.status) {
        $('#new-project').modal('hide');
        $('#title input').val("");
        $('#datetime input').val("");
        $('#pdo-project textarea').val("");
        $('.list-project').append('<div class="col-md-3"><a href="/project/'+ data.project._id+'" class="back-ground-red" data-toggle="tooltip" title="'+data.user.firstname+'"><span>'+data.project.title+'</span><label class="status-project img-circle">'+data.project.status+'</label></a></div>');
        tooltip.show();
      }
    }
  });
}

Project.prototype.Renameproject = function (data, socket) {
    socket.emit('rename_project', data);
}
// Project.prototype.AddprojectTest = function() {
//     var nowTemp = new Date();
//     var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

//     var checkin = $('#endday').datepicker({

//         beforeShowDay: function (date) {
//             return date.valueOf() >= now.valueOf();
//         },
//         autoclose: true

//     }).on('changeDate', function (ev) {
//         if (ev.date.valueOf() > checkout.datepicker("getDate").valueOf() || !checkout.datepicker("getDate").valueOf()) {

//             var newDate = new Date(ev.date);
//             newDate.setDate(newDate.getDate() + 1);
//             checkout.datepicker("update", newDate);

//         }
//         // $('#endday')[0].focus();
//     });
// }