var Mogodb   = require('../mongodb/connection');
var comments = Mogodb.comments;
var ObjectID = Mogodb.ObjectID;

exports.insertComment = function (document, callback) {
  comments.insert(document, function(errItem, resItem){
    if(resItem){
      callback(null, resItem);
    }else{
      callback(null, null);
    }
  });
}
exports.getAllComment = function (note_id, callback) {
 comments.find({note_id: note_id}).toArray(
    function(e, res) {
      if(e) callback(e)
      else callback(null, res)
    });
}
exports.updateAvatarUser = function(user_id, new_url, callback){
  comments.update({"user.user_id": String(user_id)}, {$set: {"user.avatar": new_url}}, {multi: true}, function(errItem, resItem){
    if(resItem){
      callback(null, resItem);
    }else{
      callback(null, null);
    }
  });
}