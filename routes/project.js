var Mogodb  = require('../mongodb/connection');
var US = require('../model/users');
var PJ = require('../model/projects');
var NT = require('../model/notes');

module.exports = function(app ){
  app.post('/project/new', function(req, res){
    var document ={
      user_id: req.body.dataproject.id,
      title: req.body.dataproject.title,
      deadline: req.body.dataproject.date,
      status: "Start",
      master: req.body.dataproject.id
    }
    PJ.insertProject(document, function(errProject, resProject){
      US.getUser(document.user_id, function(errUser, resUser){
        var data = {
          status: true,
          project: resProject[0],
          user: resUser,
          masseges : "Created Project"
        }
        res.send(data)
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
                console.log(resNoteS);
                res.render('project/index',{
                title: resProject.title + "| Scrum",
                project: resProject,
                user:resUser,
                noteFs: resNoteF,
                noteSs: resNoteS, 
                noteTs: resNoteT, 
                noteFos: resNoteFo  
              });
            });
          });
        })
        });
      });
    });
  });


}