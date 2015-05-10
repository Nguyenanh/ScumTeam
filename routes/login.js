var Mogodb  = require('../mongodb/connection');
var US = require('../model/users');
module.exports = function(app, passport){
	app.get('/login',function(req,res){
		if (req.isAuthenticated()){
			res.redirect('/');
		}else{
			res.render('index', {
				errors: req.flash('loginMessage'),
				messages : [],
				title : "Login Page",
			});
		}
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
	}));

	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
	 
	app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/',
        failureRedirect : '/login'
  }));
}