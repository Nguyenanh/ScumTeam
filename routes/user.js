var Mogodb  = require('../mongodb/connection');
var US = require('../model/users');
var PJ = require('../model/projects');
module.exports = function(app){
	app.get('/', function(req, res){
		if(req.session.user){
			US.getUser(req.session.user, function(errUser, resUser){
				PJ.getAllProjectUser(req.session.user, function(errProject, resProject){
					res.render('user/index',{
						title : "Dashboard",
						user : resUser,
						projects : resProject
					});
				});
			});					
		}else{
			res.redirect('/login');
		}
	});

	app.get('/logout', function(req, res){
		delete req.session.user
		res.redirect('/');
	});

	app.get('/:username', function(req, res){
		if(req.session.user){
			US.getUsername(req.param("username"), function(errItem, resItem){
				if(resItem){
					res.render('user/profile',{
						title : "Profile - " + resItem.firstname,
						user : resItem,
						errors : "",
						messages : ""
					});					
				}else {
					res.render('error',{
						title : 'Not Found'
					});
				}

			});
		}else{
			res.redirect('/login');
		}
	});

	app.post('/:username', function(req, res){
		US.getUser(req.session.user, function(errItem, resItem){
			if(req.param('oldpassword') != resItem.password){
				res.render('user/profile',{
					title : "Profile - " + resItem.firstname,
					errors : "Old Password Errors",
					user : resItem,
					messages : ""
				});
			}else{
				var document = {
					password: req.param('newpassword')
				}
				US.updateUser(req.param('id'), document, function(errItem, resItem){
					US.getUser(req.session.user, function(errUser, resUser){
						console.log(resUser);
						res.render('user/profile',{
							title : "Profile - " + resItem.firstname,
							status : true,
							massege : "Updated Password",
							user : resUser,
							errors : "",
						});
					});
				});
			}
		});
	});
	/*Ajax*/
	app.post('/user/ajaxdetail', function(req, res){
		var document = {
			displayname: req.body.dataob.displayname,
			firstname : req.body.dataob.firstname,
			lastname : req.body.dataob.lastname
		}

		US.updateUser(req.body.dataob.id, document, function(errItem, resItem){
			US.getUser(req.session.user, function(errUser, resUser){
				var user ={
					status : true,
					resUser: resUser,
					massege : "Update"
				}
				res.send(user);
			});
		});			

	});

	app.post('/user/ajaxdesc', function(req, res){
		var document = {
			description: req.body.dataob.description
		}
		US.updateUser(req.body.dataob.id, document, function(errItem, resItem){
			US.getUser(req.body.dataob.id, function(errUser, resUser){
				var user ={
					status : true,
					resUser: resUser,
					massege : "Update"
				}
				res.send(user);
			});
		});
	});
	/******************Search User Ajax *************/
	app.post('/user/ajax_search', function(req, res){
		var username = String(req.body.username);
		var user_added = req.body.list_user;
		US.searchAllUsers(username, user_added, function(errUsers, resUsers){
			res.send(resUsers);
		});
	});
	/*****************Add user in project Ajax******/
	app.post('/user/ajax_add_user', function(req, res){
		var user_id = req.body.user_id;
		US.getUser(user_id, function(errUser, resUser){
			res.send(resUser);
		});
	});
}