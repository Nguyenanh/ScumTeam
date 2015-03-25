var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var multer  = require('multer');
var Mogodb  = require('./mongodb/connection');
var US = require('./model/users');

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var session = require('express-session');

var app = express();
var done = false;
app.configure(function () {
// view engine setup
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
  }
}));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
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
var io = require('socket.io')(server);
io.sockets.on('connection', function (socket) {
  require('./socket/chat')(io,socket);
});
app.get('/chat', function(req, res){
  res.render('chat');
});
app.post('/uploadphoto',function(req, res){
  console.log(done);
  if(done==true){
    var document = {
      avatar : req.files.userPhoto.name
    };
    US.updateUser(req.session.user, document, function(errItem, resItem){
      US.getUser(req.session.user, function(errUser, resUser){
        var user ={
          status : true,
          resUser: resUser,
          massege : "Update Image"
        }
        res.send(user);
        res.end();
      });
    });
    
  }
});
require('./routes/login')(app);
require('./routes/register')(app);
require('./routes/user')(app);
require('./routes/project')(app);
require('./routes/note')(app);
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
