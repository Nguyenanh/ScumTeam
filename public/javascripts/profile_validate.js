$(document).ready(function(){
    $("#form-change-password").validate({ 
        rules: { 
            cfnewpassword: { 
                equalTo: "#newpassword" 
            },
            oldpassword: { 
                required: true, 
                minlength: 6, 
            },
            newpassword: { 
                required: true, 
                minlength: 6, 
            },
        }, 
    }); 
});