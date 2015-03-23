$(document).ready(function(){
    var validator = $("#form-register").validate({ 
        rules: { 
            password: { 
                required: true, 
                minlength: 6, 
            }, 
            password_confirmation: { 
                equalTo: "#password" 
            }, 
            username: { 
                required: true, 
            }
        }, 
        messages: { 
            password: { 
                required: "Hãy điền mật khẩu", 
                minlength: "Mật khẩu ít nhất 6 ký tự"
            }, 
            password_confirmation: { 
                equalTo: "Mật khẩu xác nhận không chính xác" 
            }, 
            username: { 
                required: "Hãy điền Username", 
            }
        }
    }); 
});