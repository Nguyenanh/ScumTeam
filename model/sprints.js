var Mogodb      = require('../mongodb/connection');
var sprints = Mogodb.sprints;
var ObjectID = Mogodb.ObjectID;
exports.updateSprint = function(project_id, document, callback) {
  sprints.update({_id: new ObjectID(project_id)}, {$set: document}, function(errItem, resItem){
    if(resItem){
      callback(null, resItem);
    }else{
      callback(null, null);
    }
  });
};
exports.insertSprint = function(document, callback){
  sprints.insert(document, function(errItem, resItem){
    if(resItem){
      callback(null, resItem);
    }else{
      callback(null, null);
    }
  });
};

exports.removeSprint = function(project_id, callback){
  sprints.remove({project_id: new ObjectID(project_id)}, function(errItem, resItem) {
    if(resItem){
      callback(null, resItem);
    }else{
      callback(null, null);
    }
  });
};

exports.getNumberSprint = function(date_current, project_id, callback){
  sprints.findOne({start: {$lte : date_current}, end: {$gte: date_current}, project_id : new ObjectID(project_id)},  function(errItem, resItem){
    if(resItem){
      callback(null, resItem);
    }else{
      callback(null, null);
    }
  });
};