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

exports.getAllProject = function(list_project_id, callback){
  projects.find({_id: {$in: list_project_id}}).toArray(
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
exports.updateProject = function(project_id, document, callback) {
  projects.update({_id: new ObjectID(project_id)}, {$set: document}, function(errItem, resItem){
    if(resItem){
      callback(null, resItem);
    }else{
      callback(null, null);
    }
  });
};

exports.addUserProject = function(project_id, document, callback) {
  projects.update({_id: new ObjectID(project_id)}, { $push: { user_ids: document } }, function(errItem, resItem){
    if(resItem){
      callback(null, resItem);
    }else{
      callback(null, null);
    }
  });
};

exports.removeUserProject = function(project_id, user_id, callback) {
  projects.update({_id: new ObjectID(project_id)}, {$pull: {user_ids: new ObjectID(user_id)}}, function(errItem, resItem) {
    if(resItem){
      callback(null, resItem);
    }else{
      callback(null, null);
    }
  });
}