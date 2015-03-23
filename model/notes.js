var Mogodb      = require('../mongodb/connection');
var notes = Mogodb.notes;
var ObjectID = Mogodb.ObjectID;
exports.insertNote = function(document, callback) { 
  notes.insert(document, function(errItem, resItem){
    if (resItem){
      callback(null, resItem);     
    }else {
      callback(null, null);   
    }
  });
}

/***get all note colum first **/
exports.getAllNoteColFirst = function(project_id, callback) {
  notes.find({project_id: project_id, column: 1 }).toArray(
    function(e, res) {
      if(e) callback(e)
      else callback(null, res)
    });
}
/***get all note colum second **/
exports.getAllNoteColSecond = function(project_id, callback) {
  notes.find({project_id: project_id,  column: 2 }).toArray(
    function(e, res) {
      if(e) callback(e)
      else callback(null, res)
    });
}
/***get all note colum third **/
exports.getAllNoteColThird = function(project_id, callback) {
  notes.find({project_id: project_id, column: 3 }).toArray(
    function(e, res) {
      if(e) callback(e)
      else callback(null, res)
    });
}
/***get all note colum four **/
exports.getAllNoteColFour = function(project_id, callback) {
  notes.find({project_id: project_id, column: 4 }).toArray(
    function(e, res) {
      if(e) callback(e)
      else callback(null, res)
    });
}
/***update note ***/
exports.updateNote = function(note_id, document, callback) {
  notes.update({_id: new ObjectID(note_id)}, {$set: document}, function(errItem, resItem){
    if(resItem){
      callback(null, resItem);
    }else{
      callback(null, null);
    }
  });
}

exports.getNote = function(note_id, callback){
  notes.findOne({_id: new ObjectID(note_id)},  function(errItem, resItem){
    if(resItem){
      callback(null, resItem);
    }else{
      callback(null, null);
    }
  });
};
exports.deleteNote = function(note_id, callback){
  notes.remove({"_id": ObjectID(note_id)}, function(errItem, resItem){
    callback(null, null);
  });
};