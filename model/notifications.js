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
}