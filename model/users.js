var Mogodb   	  = require('../mongodb/connection');
var users = Mogodb.users;
var ObjectID = Mogodb.ObjectID;
exports.getAllUsers = function(callback){
	users.find({})
	.toArray(
	function(e, res) {
	if (e) callback(e)
	else callback(null, res)
	});
};

exports.insertUser = function(document, callback){
	users.insert(document, function(errItem, resItem){
		if(resItem){
			callback(null, resItem);
		}else{
			callback(null, null);
		}
	});
};

exports.checkAlreadyUser = function(username, callback){
	users.findOne({username: username}, function(errItem, resItem){
		if(resItem){
			callback(null,resItem);
		}else{
			callback(null,null);
		}
	});
};
exports.checkAlreadyUserEmail = function(email, callback){
	users.findOne({email: email}, function(errItem, resItem){
		if(resItem){
			callback(null,resItem);
		}else{
			callback(null,null);
		}
	});
};
exports.checkUser = function(username, password, callback){
	users.findOne({username: username, password: password}, function(errItem, resItem){
		if(resItem){
			callback(null, resItem);
		}else{
			callback(null, null);
		}
	});
};
exports.getUser = function(user_id, callback){
	users.findOne({_id: new ObjectID(user_id)},  function(errItem, resItem){
		if(resItem){
			callback(null, resItem);
		}else{
			callback(null, null);
		}
	});
};

exports.getUsername = function(username, callback){
	users.findOne({username: username},  function(errItem, resItem){
		if(resItem){
			callback(null, resItem);
		}else{
			callback(null, null);
		}
	});
};
exports.getEmail = function(email, callback){
	users.findOne({email: email},  function(errItem, resItem){
		if(resItem){
			callback(null, resItem);
		}else{
			callback(null, null);
		}
	});
};
exports.updateUser = function(user_id, document, callback) {
	users.update({_id: new ObjectID(user_id)}, {$set: document}, function(errItem, resItem){
		if(resItem){
			callback(null, resItem);
		}else{
			callback(null, null);
		}
	});
};
exports.searchAllUsers = function(name, user_added, callback){
	users.find({$and: [{username: new RegExp(name)},{username: {$nin: user_added}}]})
	.limit(5)
	.toArray(
	function(e, res) {
	if (e) callback(e)
	else callback(null, res)
	});
};
exports.getAllUser = function(list_user_id, callback){
  users.find({_id: {$in: list_user_id}}).toArray(
    function(e, res){
      if (e) callback(e)
      else callback(null, res)
    });
};
exports.addProjectUser = function(user_id, document, callback) {
	users.update({_id: new ObjectID(user_id)},  { $push: { project_ids: document } }, function(errItem, resItem){
		if(resItem){
			callback(null, resItem);
		}else{
			callback(null, null);
		}
	});
};
exports.removeProjectUser = function(user_id, project_id, callback) {
  users.update({_id: new ObjectID(user_id)}, {$pull: {project_ids: new ObjectID(project_id)}}, function(errItem, resItem) {
    if(resItem){
      callback(null, resItem);
    }else{
      callback(null, null);
    }
  });
}