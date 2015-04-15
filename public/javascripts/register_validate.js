$(document).ready(function(){
    var validator = $("#form-register").validate({ 
        rules: { 
            password: { 
                required: true, 
                minlength: 6, 
            },
            email: { 
                required: true,
                email: true,
            },
            password_confirmation: { 
                equalTo: "#password" 
            }, 
            username: { 
                required: true, 
            }
        }, 
    }); 
});