var Mogodb  = require('../mongodb/connection');
var NT = require('../model/notes');
var CM = require('../model/comments');
var PJ = require('../model/projects');
var US = require('../model/users');
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
      NT.getNoteColum(data.project_id, data.column, function(errNoteNews, resNoteNews){
        NT.getNoteColum(data.project_id, column_old, function(errNoteOlds, resNoteOlds){
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
    socket.on('rename_project', function (data) {
      var document = {
        title : data.project_name,
        sprint : data.project_sprint,
        deadline : data.project_deadline,
      }
      PJ.updateProject(data.project_id, document, function(errProjectUpdate, resProjectUpdate) {
        PJ.getProject(data.project_id, function(errProject, resProject) {
          io.sockets.emit(data.project_id+'_rename_project', resProject);
        });
      });
    });
    
    socket.on('add_user_story', function (data){

    });
  });
}