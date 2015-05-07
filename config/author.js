var Mogodb  = require('../mongodb/connection');
var US = require('../model/users');
var PJ = require('../model/projects');
var ObjectID = Mogodb.ObjectID;
exports.authorproject = function(req, res, next) {
  PJ.getProject(req.param("project_id"), function(errProject, resProject) {
    US.getUser(req.user._id, function(errUser, resUser) {
      next();
      var list_users = resProject.user_ids.map(function(item) {
        return item.toString();
      });
      if(list_users.indexOf(String(resUser._id)) > -1){
        return true;
      }else{
        res.send("You can not permission!!!!");
      }
    });
  });
}

