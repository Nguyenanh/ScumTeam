var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash        = require('connect-flash');
var multer  = require('multer');
var Mogodb  = require('./mongodb/connection');
var US = require('./model/users');
var NT = require('./model/notes');
var connect = require('connect');

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var session = require('express-session');

var app = express();
var done = false;
app.configure(function () {
// view engine setup
app.use(favicon(__dirname + 'public/images/favicon.ico'));
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.methodOverride());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(multer({ dest: './public/uploads/images',
 rename: function (fieldname, filename) {
    return filename+Date.now();
  },
  onFileUploadStart: function (file, req, res) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function (file, req, res) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
    done = true;
    console.log(done);
  }
}));

app.use(session({secret: 'ilovescotchscotchyscotchscotch'}));// session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(app.router);
});


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
var server = http.createServer(app);
app.post('/uploadphoto',function(req, res){
  console.log(done);
  if(done==true){
    var document = {
      avatar : 'http://localhost:3000/uploads/images/'+req.files.userPhoto.name
    };
    US.updateUser(req.user._id, document, function(errItem, resItem){
      US.getUser(req.user._id, function(errUser, resUser){
        NT.updateAvatarUser(req.user._id, document.avatar, function(errNote, resNote){
          console.log(req.user._id);
          console.log(document.avatar);
          var user ={
            status : true,
            resUser: resUser,
            massege : "Update Image"
          }
          res.send(user);
          res.end();
        });
      });
    });
    
  }
});
var io = require('socket.io')(server);
var people_status = {};
var status = false;
var auth = require('./routes/auth');
var author = require('./config/author');
require('./socket/socket')(io, people_status, status);
require('./routes/login')(app, passport);
require('./routes/notification')(app);
require('./routes/register')(app, passport);
require('./routes/user')(app, auth);
require('./routes/project')(app, auth, author);
require('./routes/comment')(app);
require('./routes/note')(app);
require('./routes/sprint')(app);
require('./config/passport')(passport);
app.get('/chat', function(req, res){
  res.render('chat');
});


app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
module.exports = app;
