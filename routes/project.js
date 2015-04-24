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

    var day_current = new Date(document.start_date.getFullYear(), document.start_date.getMonth(), 0).getDate();
    var count_day_current = day_current + document.start_date.getDate();

    var date_new= new Date(document.deadline);
    var date_deadline = new Date(date_new.getFullYear(), date_new.getMonth(), 0).getDate();
    var count_day_deadline = date_deadline + date_new.getDate();

    var count_date_of_sprint = parseInt(count_day_deadline - count_day_current)

    var date_sprint = new Date(document.start_date);
    document.count_date_of_sprint = count_date_of_sprint;

    var day_end_project = new Date(document.start_date);

    day_end_project.setDate(day_end_project.getDate() + (count_date_of_sprint*parseInt(document.sprint)));
    document.deadline = day_end_project.getFullYear()+"/"+(day_end_project.getMonth()+1) +"/"+day_end_project.getDate();
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
      var new_date = new Date();
      var date_current = new_date.getFullYear()+"/"+(new_date.getMonth()+1)+"/"+new_date.getDate();
      SP.getNumberSprint(date_current, req.param('project_id'), function(errSprint, resSprint){
        US.getUser(req.session.user, function(errUser, resUser){
          NT.getAllNoteColFirst(resSprint.number, req.param('project_id'), function(errNoteF, resNoteF){
            NT.getAllNoteColSecond(resSprint.number, req.param('project_id'), function(errNoteS, resNoteS){
              NT.getAllNoteColThird(resSprint.number, req.param('project_id'), function(errNoteT, resNoteT){
                NT.getAllNoteColFour(resSprint.number, req.param('project_id'), function(errNoteFo, resNoteFo){
                  US.getAllUser(resProject.user_ids, function(errListUser, resListUser){
                    NT.getCountNote(req.param('project_id'), resSprint.number, function(errCountNote, resCountNote){
                      NT.getCountPoint(req.param('project_id'), resSprint.number,  function(errCountPoint, resCountPoint){
                        if (resCountPoint[0]) {
                          var countpoints =  resCountPoint[0].estimate;
                        }
                        else {
                          var countpoints = 0;
                        }
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
                          countNotes : resCountNote,
                          countPoints : countpoints,
                        });
                      });
                    });
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