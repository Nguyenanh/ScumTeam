var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var ObjectID	= require('mongodb').ObjectID;
var dbPort 		= 27017;
var dbHost 		= 'localhost';
var dbName 		= 'datn';
var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
db.open(function(e, d){
	if (e) {
		//console.log(e);
	} else{
		console.log('connected to database :: ' + dbName);
	}
});
module.exports = {
	crypto:crypto,
	users:db.collection('users'),
  projects:db.collection('projects'),
  notes:db.collection('notes'),
  comments:db.collection('comments'),
	ObjectID:ObjectID,
}