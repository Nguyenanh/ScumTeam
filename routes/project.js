var Mogodb  = require('../mongodb/connection');
var US = require('../model/users');
var PJ = require('../model/projects');
var NT = require('../model/notes');
var ObjectID = Mogodb.ObjectID;
module.exports = function(app){
  app.post('/project/new', function(req, res){
    var user_ids = [];
    user_ids.push(new ObjectID(req.body.dataproject.master_id))
    var document ={
      title: req.body.dataproject.title,
      deadline: req.body.dataproject.date,
      status: "Start",
      master: req.body.dataproject.master,
      master_id: req.body.dataproject.master_id,
      user_ids: user_ids,
    }
    PJ.insertProject(document, function(errProject, resProject){
      US.getUser(req.body.dataproject.master_id, function(errUser, resUser){
        US.addProjectUser(req.body.dataproject.master_id, resProject[0]._id, function(errAddProject, resAddProject){
          var data = {
            status: true,
            user: resUser,
            project:resProject[0],
            masseges : "Created Project"
          }
          res.send(data)
        });
      });
    });
  });

  app.get('/project/:project_id', function(req, res){
    PJ.getProject(req.param('project_id'), function(errProject, resProject){
      US.getUser(req.session.user, function(errUser, resUser){
        NT.getAllNoteColFirst(req.param('project_id'), function(errNoteF, resNoteF){
          NT.getAllNoteColSecond(req.param('project_id'), function(errNoteS, resNoteS){
            NT.getAllNoteColThird(req.param('project_id'), function(errNoteT, resNoteT){
              NT.getAllNoteColFour(req.param('project_id'), function(errNoteFo, resNoteFo){
                US.getAllUser(resProject.user_ids, function(errListUser, resListUser){
                  res.render('project/index',{
                    title: resProject.title + "| Scrum",
                    project: resProject,
                    user:resUser,
                    noteFs: resNoteF,
                    noteSs: resNoteS, 
                    noteTs: resNoteT, 
                    noteFos: resNoteFo,
                    userAll: resListUser,
                  });
                });
              });
            });
          });
        });
      });
    });
  });


}