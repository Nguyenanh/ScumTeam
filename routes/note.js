var Mogodb  = require('../mongodb/connection');
var NT = require('../model/notes');
var CM = require('../model/comments');
var ObjectID = Mogodb.ObjectID;
module.exports = function(app){
  app.post('/note/ajaxnewnote', function(req, res){
    var note = {
       project_id: req.body.data.id,
       content: req.body.data.content,
       estimate: parseInt(req.body.data.estimate),
       rate: req.body.data.rate,
       sprint_number: parseInt(req.body.data.sprint_number),
       column: 1,
       assign: "f",
       user: null,
       owner: 0,
       
    }
    NT.insertNote(note, function(errNote, resNote){
      res.send(resNote)
    });
  });

  app.post('/note/ajax_update', function(req, res){
    if(parseInt(req.body.datanote.column) == 1) {
      var document = {
        column : parseInt(req.body.datanote.column),
        user: req.body.datanote.user,
        assign : req.body.datanote.assign,
        owner: parseInt(req.body.datanote.owner),
      }
    }
    else {
      if(req.body.datanote.owner == 0) {
        var document = {
          column : parseInt(req.body.datanote.column),
          user: req.body.datanote.user,
          assign : req.body.datanote.assign,
          owner: 1,
        }
      }else {
        var document = {
          column : parseInt(req.body.datanote.column),
          assign : req.body.datanote.assign,
        }
      }
    }
    var current_date = new Date();
    document.date_complete = current_date.getFullYear()+"/"+(current_date.getMonth()+1)+"/"+current_date.getDate();
    NT.updateNote(req.body.datanote.note_id, document, function(errNote, resNote){
      NT.getNote(req.body.datanote.note_id, function(erraNote, resaNote){
        res.send(resaNote);
      });
    });
  });

  app.post('/note/ajax_delete', function(req, res){
    NT.deleteNote(req.body.note_id, function(errNote, resNote){
      var status = true;
      res.send(status);
    });
  });

  app.post('/note/ajax_node_detail', function(req, res) {
    NT.getNote(req.body.note_id, function(errNote, resNote) {
      CM.getAllComment(req.body.note_id, function(errComments, resComments) {
        var data ={
          note: resNote,
          comments : resComments,
        }
        res.send(data);
      })
    });
  });

  app.post('/note/ajax_get_note_done', function(req, res) {
    NT.getAllNoteColFour(parseInt(req.body.data.sprint_number), req.body.data.project_id, function(errNote, resNote) {
      res.send(resNote);
    });
  });
}