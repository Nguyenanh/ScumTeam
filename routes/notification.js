var Mogodb  = require('../mongodb/connection');
var NO = require('../model/notifications');
var ObjectID = Mogodb.ObjectID;
module.exports = function(app){
  app.post('/notification/ajax_getall', function(req, res) {
    NO.allNotification(req.param("user_id"), function(errNoti, resNoti) {
      console.log(resNoti);
      NO.updateallNotification(req.param("user_id"), function(errNotiU, resNotiU) {
        res.send(resNoti);
      });
    });
  });
}