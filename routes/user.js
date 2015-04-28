var Mogodb  = require('../mongodb/connection');
var US = require('../model/users');
var PJ = require('../model/projects');
var ObjectID = Mogodb.ObjectID;
module.exports = function(app){
	app.get('/', function(req, res){
		if(req.session.user){
			US.getUser(req.session.user, function(errUser, resUser){
				PJ.getAllProject(resUser.project_ids, function(errListProject, resListProject){
					res.render('user/index',{
						title : "Dashboard",
						user : resUser,
						projects : resListProject,
					});
				});
			});					
		}else{
			res.redirect('/login');
		}
	});

	app.get('/logout', function(req, res){
		US.getUser(req.session.user, function(errUser, resUser){
			delete req.session.user
			res.redirect('/');
		});
	});

	app.get('/:username', function(req, res){
		if(req.session.user){
			US.getUsername(req.param("username"), function(errUserProfile, resUserProfile){
				US.getUser(req.session.user, function(errItem, resItem){
				if(resItem){
					res.render('user/profile',{
						title : "Profile - " + resItem.firstname,
						user : resItem,
						UserProfile : resUserProfile,
						errors : "",
						messages : ""
					});					
				}else {
					res.render('error',{
						title : 'Not Found'
					});
				}
				})
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
				US.updateUser(req.session.user, document, function(errItem, resItem){
					US.getUsername(req.param('username'), function(errUser, resUser){
						res.render('user/profile',{
							title : "Profile - " + resUser.firstname,
							status : true,
							messages : "Updated Password",
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
		var user_id =new ObjectID(req.body.data.user_id);
		var project_id = new ObjectID(req.body.data.project_id);
		PJ.addUserProject(project_id, user_id, function(errAddUser, resAddUser){
			US.addProjectUser(user_id, project_id, function(errAddProject, resAddProject){
				US.getUser(user_id, function(errUser, resUser){
					res.send(resUser);
				});
			});
		});
	});
}