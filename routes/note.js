var Mogodb  = require('../mongodb/connection');
var NT = require('../model/notes');
module.exports = function(app){
  app.post('/note/ajaxnewnote', function(req, res){
    var note = {
       project_id: req.body.data.id,
       content: req.body.data.content,
       estimate: req.body.data.estimate,
       rate: req.body.data.rate,
       column: 1,
    }
    NT.insertNote(note, function(errNote, resNote){
      res.send(resNote)
    });
  });

  app.post('/note/ajax_update', function(req, res){
    var document = {
      column : parseInt(req.body.datanote.column)
    }
    console.log(document);
    NT.updateNote(req.body.datanote.note_id, document, function(errNote, resNote){
      NT.getNote(req.body.datanote.note_id, function(erraNote, resaNote){
        console.log(resaNote);
        res.send(resaNote);
      })
    });
  });

  app.post('/note/ajax_delete', function(req, res){
    console.log(req.body.note_id);
    NT.deleteNote(req.body.note_id, function(errNote, resNote){
      var status = true;
      res.send(status);
    });
  });
}