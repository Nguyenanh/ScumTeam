$(document).ready(function(){
    var validator = $("#login_validate").validate({ 
        rules: { 
            password: { 
                required: true, 
            }, 
            email: { 
                required: true, 
                email: true
            }
        }, 
        messages: { 
            password: { 
                required: "Hãy điền mật khẩu", 
            }, 
            email: { 
                required: "Hãy nhập 1 địa chỉ email hợp lệ", 
            }
        }
    }); 
});