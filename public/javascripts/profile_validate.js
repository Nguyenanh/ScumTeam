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
        messages: { 
            cfnewpassword: { 
                equalTo: "Mật khẩu xác nhận không chính xác", 
            },
            oldpassword: { 
                required: "Hãy điền mật khẩu", 
                minlength: "Mật khẩu ít nhất 6 ký tự"
            }, 
            newpassword: { 
                required: "Hãy điền mật khẩu", 
                minlength: "Mật khẩu ít nhất 6 ký tự"
            },
        }
    }); 
});