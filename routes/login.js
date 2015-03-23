var Mogodb  = require('../mongodb/connection');
var US = require('../model/users');
module.exports = function(app ){
	app.get('/login',function(req,res){
		if(req.session.user) {
			res.redirect('/');
		}else{
			res.render('index', {
				title : "Login Page",
				messages : "",
				errors : ""
			});
		}

	});

	app.post('/login', function(req, res){
		US.checkUser(req.param('username'), req.param('password'), function(errItem, resItem){
			if(!resItem){
				res.render('index',{
					title : "Login Page",
					messages : "",
					errors : "Username or Password error."
				});
			}else{
				req.session.user = resItem._id
				res.redirect('/');
			}
		});
	});
}