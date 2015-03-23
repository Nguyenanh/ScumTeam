var Mogodb      = require('../mongodb/connection');
var projects = Mogodb.projects;
var ObjectID = Mogodb.ObjectID;

exports.insertProject = function(document, callback){
  projects.insert(document, function(errProject, resProject){
    if(resProject){
      callback(null, resProject);
    }else{
      callback(null, null);
    }
  });
};

exports.getAllProjectUser = function(user_id, callback){
  projects.find({user_id: user_id}).toArray(
    function(e, res){
      if (e) callback(e)
      else callback(null, res)
    });
};
exports.getProject = function(project_id, callback){
  projects.findOne({_id: new ObjectID(project_id)},  function(errItem, resItem){
    if(resItem){
      callback(null, resItem);
    }else{
      callback(null, null);
    }
  });
};