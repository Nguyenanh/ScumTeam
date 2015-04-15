var Mogodb  = require('../mongodb/connection');
var US = require('../model/users');
var PJ = require('../model/projects');
var NT = require('../model/notes');
var SP = require('../model/sprints');
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
      pdo : req.body.dataproject.pdo,
      sprint : req.body.dataproject.spring,
      start_date : new Date(),
      created_at : new Date(),
      updated_at : new Date(),
    }
    var day_current = new Date(document.created_at.getFullYear(), document.created_at.getMonth(), 0).getDate();
    var count_day_current = day_current + document.created_at.getDate();
    var date_new= new Date(document.deadline);
    var date_deadline = new Date(date_new.getFullYear(), date_new.getMonth(), 0).getDate();
    var count_day_deadline = date_deadline + date_new.getDate();
    var count_date_of_sprint = parseInt(count_day_deadline - count_day_current)/parseInt(document.sprint);

    var date_sprint = new Date(document.created_at);
    document.count_date_of_sprint = count_date_of_sprint;
    PJ.insertProject(document, function(errProject, resProject){ 
      for(var i = 1; i <= parseInt(document.sprint); i++) {
        var start_sprint = new Date(date_sprint);
        start_sprint.setDate(start_sprint.getDate() + 0);

        var next_sprint = new Date(start_sprint);

        next_sprint.setDate(next_sprint.getDate() + count_date_of_sprint);
        var document_sprint = {
          number : i,
          project_id :resProject[0]._id,
          start : start_sprint.getFullYear()+"/"+(start_sprint.getMonth()+1) +"/"+start_sprint.getDate(),
          end : next_sprint.getFullYear()+"/"+(next_sprint.getMonth()+1)+"/"+next_sprint.getDate(),
        };
        SP.insertSprint(document_sprint, function(errSprint, resSprint){});
        date_sprint = next_sprint;
      };
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
                  SP.getNumberSprint(1, req.param('project_id'), function(errSprint, resSprint){
                    res.render('project/index',{
                    title: resProject.title + "| Scrum",
                    project: resProject,
                    user:resUser,
                    noteFs: resNoteF,
                    noteSs: resNoteS, 
                    noteTs: resNoteT, 
                    noteFos: resNoteFo,
                    userAll: resListUser,
                    sprint : resSprint,
                  });
                  })
                });
              });
            });
          });
        });
      });
    });
  });


}