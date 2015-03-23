var Mogodb  = require('../mongodb/connection');
var US = require('../model/users');
var user = {
	firstname :"",
	lastname : "",
	username : "",
	email : "",
}
module.exports = function(app ) {
	app.get('/register',function(req, res) {
		US.getAllUsers(function(errUsers,resUsers) {
			var user = {
				firstname :"",
				lastname : "",
				username : "",
				email : "",
			}
			res.render('register', {
				title : "Register Account",
				messages : "",
				errors : "",
				user : user
			});
		});
	});

	app.post('/register', function(req, res) {
		console.log("aaa");
		var document = {
			firstname : req.param('first_name'),
			lastname : req.param('last_name'),
			username : req.param('username'),
			email : req.param('email'),
			password : req.param('password'),
		}
		US.checkAlreadyUser(req.param('username'), function(errItem, resItem){
			if(resItem == null){
				US.insertUser(document, function(errUser, resUser) {
					US.getUsername(req.param('username'), function(errUsername, resUsername) {
						req.session.user = resUsername._id
						res.redirect('/');
					});
				});
			}else{
				res.render('register', {
					title : "Register Account",
					messages : "",
					errors : "Username Already exists",
					user : document
				});
			}
		});
	});
}