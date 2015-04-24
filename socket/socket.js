var Mogodb  = require('../mongodb/connection');
var NT = require('../model/notes');
var CM = require('../model/comments');
var PJ = require('../model/projects');
var US = require('../model/users');
var SP = require('../model/sprints');
var ObjectID = Mogodb.ObjectID;
module.exports = function(io, people_status){
  io.on('connection', function (socket) {
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    
    io.sockets.emit('people_status', people_status);

    socket.on('create_new_note', function (data) {
      io.sockets.emit('create_new_note', data);
    });

/********* Drag Drop **************/
    var column_old = "";
    socket.on('dragdrop_note_old', function (data) {
      column_old = data;
    });
    socket.on('dragdrop_note', function (data) {
      NT.getNoteColum(data.project_id, data.column, parseInt(data.sprint_number), function(errNoteNews, resNoteNews){
        NT.getNoteColum(data.project_id, column_old, parseInt(data.sprint_number), function(errNoteOlds, resNoteOlds){
          var list_notes = {
            project_id : data.project_id,
            note_news :resNoteNews,
            column_new : data.column,
            column_old : column_old,
            note_olds : resNoteOlds,
          }
          io.sockets.emit('dragdrop_note', list_notes);
        });
      });
    });
/*********End Drag Drop **************/  
/*********New Comment ***************/
    socket.on('comment_socket', function (data) {
      CM.insertComment(data.comment, function(errComment, resComment) {
        io.sockets.emit(data.project_id+'_comment_socket', resComment[0]);
      });
    });  
/*********End New Comment ***********/

/************New Project ************/
    socket.on('new_project_room', function (data) {
      var project_id = data;
      PJ.getProject(project_id, function(errProject, resProject){
        US.getUser(resProject.master_id, function(errUser, resUser){
          var data ={
            user : resUser,
            project : resProject,
          }
          io.sockets.emit('new_project_room', data);
        });
      });
    });

/*************Rename Project ***********/
    socket.on('edit_project', function (data) {
      if(data.project_deadline == '') {
        var document = {
          title : data.project_name,
          pdo : data.project_content,
        }
        PJ.updateProject(data.project_id, document, function(errProjectUpdate, resProjectUpdate) {
          PJ.getProject(data.project_id, function(errProject, resProject) {
            io.sockets.emit(data.project_id+'_edit_project', resProject);
          });
        });
      }else {
        var document = {
          title : data.project_name,
          pdo : data.project_content,
          sprint : parseInt(data.project_sprint),
        }
        var day_now = new Date();
        var day_current = new Date(day_now.getFullYear(), day_now.getMonth(), 0).getDate();
        var count_day_current = day_current + day_now.getDate();

        var date_new= new Date(data.project_deadline);
        var date_deadline = new Date(date_new.getFullYear(), date_new.getMonth(), 0).getDate();
        var count_day_deadline = date_deadline + date_new.getDate();

        var count_date_of_sprint = parseInt(count_day_deadline - count_day_current);


        document.count_date_of_sprint = count_date_of_sprint;
        var day_end_project = new Date(day_now);
        day_end_project.setDate(day_end_project.getDate() + (count_date_of_sprint*parseInt(document.sprint)));

        document.deadline = day_end_project.getFullYear()+"/"+(day_end_project.getMonth()+1) +"/"+day_end_project.getDate();
        
        var date_sprint = new Date(day_now);

        PJ.updateProject(data.project_id, document, function(errProjectUpdate, resProjectUpdate) {
          SP.removeSprint(data.project_id, function(errSprint, resSprint){});
          for(var i = 1; i <= parseInt(document.sprint); i++) {
            var start_sprint = new Date(date_sprint);
            start_sprint.setDate(start_sprint.getDate() + 0);

            var next_sprint = new Date(start_sprint);

            next_sprint.setDate(next_sprint.getDate() + count_date_of_sprint);
            var document_sprint = {
              number : i,
              project_id :new ObjectID(data.project_id),
              start : start_sprint.getFullYear()+"/"+(start_sprint.getMonth()+1) +"/"+start_sprint.getDate(),
              end : next_sprint.getFullYear()+"/"+(next_sprint.getMonth()+1)+"/"+next_sprint.getDate(),
            };
            SP.insertSprint(document_sprint, function(errSprint, resSprint){});
            date_sprint = next_sprint;
          };
          io.sockets.emit(data.project_id+'_edit_project', resProjectUpdate);
        });
      }

    });
/************Caculate Chart*****************/   
    socket.on('caculate_chart', function (data){
      NT.getCountNote(data.project_id, parseInt(data.sprint_number), function(errCountNote, resCountNote){
        NT.getCountPoint(data.project_id, parseInt(data.sprint_number),  function(errCountPoint, resCountPoint){
          NT.getAllNoteColFour(parseInt(data.sprint_number), data.project_id, function(errNote, resNote) {
            var data_chart = {
              count_note: resCountNote,
              count_point: resCountPoint[0].estimate,
              resNote: resNote,
            }
            io.sockets.emit(data.project_id+'_caculate_chart', data_chart);
          });
        });
      });
    });
  });
}