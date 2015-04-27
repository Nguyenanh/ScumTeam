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
exports.getAllNoteColFirst = function(number, project_id, callback) {
  notes.find({project_id: project_id, column: 1, sprint_number :number }).toArray(
    function(e, res) {
      if(e) callback(e)
      else callback(null, res)
    });
}
/***get all note colum second **/
exports.getAllNoteColSecond = function(number, project_id, callback) {
  notes.find({project_id: project_id,  column: 2, sprint_number :number }).toArray(
    function(e, res) {
      if(e) callback(e)
      else callback(null, res)
    });
}
/***get all note colum third **/
exports.getAllNoteColThird = function(number, project_id, callback) {
  notes.find({project_id: project_id, column: 3, sprint_number :number }).toArray(
    function(e, res) {
      if(e) callback(e)
      else callback(null, res)
    });
}
/***get all note colum four **/
exports.getAllNoteColFour = function(number, project_id, callback) {
  notes.find({project_id: project_id, column: 4, sprint_number :number }).toArray(
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
exports.getNoteColum = function(project_id, column, sprint_number, callback){
  notes.find({project_id: project_id, column: column, sprint_number : sprint_number }).toArray(
    function(e, res) {
      if(e) callback(e)
      else callback(null, res)
    });
};
exports.getCountNote = function(project_id, sprint_number, callback){
  notes.find({project_id: project_id, sprint_number : sprint_number}).count(
    function(err, result) {
      callback(null,result);
    }
  );
};
exports.getCountPoint = function(project_id, sprint_number, callback){
  notes.aggregate([{ $match : {project_id: project_id, sprint_number: sprint_number} },{$group:{_id: "", estimate: {$sum: "$estimate"}}}], function(err, result) {
    if(result){
       callback(err, result);
     }
    else {
      callback(null, result);
    }
  });
};

