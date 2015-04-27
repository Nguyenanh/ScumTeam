var Mogodb   = require('../mongodb/connection');
var notifications = Mogodb.notifications;
var ObjectID = Mogodb.ObjectID;
exports.insertNotification = function (document, callback) {
  notifications.insert(document, function(errItem, resItem){
    if(resItem){
      callback(null, resItem);
    }else{
      callback(null, null);
    }
  });
};
exports.getallNotification = function (user_id, callback) {
  notifications.find({recent_id: user_id, readed: 0}).count(
    function(err, result) {
      callback(null,result);
    }
  );
};
exports.allNotification = function (user_id, callback) {
  notifications.find({recent_id: user_id}).toArray(
    function(e, res) {
      if(e) callback(e);
      else callback(null, res);
    }
  );
};
exports.updateallNotification = function (user_id, callback) {
  notifications.update({recent_id: user_id, readed: 0}, {$set :{readed :1 }}, function(errItem, resItem) {
    if(resItem){
      callback(null, resItem);
    }else{
      callback(null, null);
    }
  });
};