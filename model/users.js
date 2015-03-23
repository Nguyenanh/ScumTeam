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
exports.updateUser = function(user_id, document, callback) {
	users.update({_id: new ObjectID(user_id)}, {$set: document}, function(errItem, resItem){
		if(resItem){
			callback(null, resItem);
		}else{
			callback(null, null);
		}
	});
};
exports.searchAllUsers = function(name, callback){
	users.find({username: new RegExp(name)})
	.toArray(
	function(e, res) {
	if (e) callback(e)
	else callback(null, res)
	});
};