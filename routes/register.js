var Mogodb  = require('../mongodb/connection');
var US = require('../model/users');
var bcrypt   = require('bcrypt-nodejs');
var user = {
	firstname :"",
	lastname : "",
	username : "",
	email : "",
}
module.exports = function(app, passport) {
	app.get('/register',function(req, res) {
		console.log(req.ip)
		US.getAllUsers(function(errUsers,resUsers) {
			var user = {
				firstname :"",
				lastname : "",
				username : "",
				email : "",
			}
			res.render('register', {
				title : "Register Account",
				messages: [],
				errors : req.flash('signupErrors'),
				user : user
			});
		});
	});

	app.post('/register', passport.authenticate('local-register', {
    successRedirect : '/',
    failureRedirect : '/register',
    failureFlash : true
	}));
}


