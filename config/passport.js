// load all the things we need
var LocalStrategy   = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    Mogodb  = require('../mongodb/connection'),
    US = require('../model/users'),
    bcrypt   = require('bcrypt-nodejs');
    configAuth = require('./auth');
module.exports = function(passport) {
  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  passport.deserializeUser(function(id, done) {
    US.getUser(id, function(err, user) {
        done(err, user);
    });
  });

  passport.use('local-register', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
  },
    function(req, username, password, done) {
      process.nextTick(function() {
      US.checkAlreadyUser(username, function(err, user) {
        if (err)
          return done(err);
        if (user) {
            return done(null, false, req.flash('signupErrors', 'That username is already taken.'));
        } else {
          var document = {
           firstname : req.param('first_name'),
           lastname : req.param('last_name'),
           username : req.param('username'),
           email : req.param('email'),
           password : bcrypt.hashSync(req.param('password'), bcrypt.genSaltSync(8), null),
           avatar : "default.jpg",
           project_ids :[]
          }
          US.insertUser(document, function(errUser, resUser) {
            return done(null, resUser[0]);
          });
        }
      });
    });
  }));
  passport.use('local-login', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, username, password, done) {
    US.getUsername(username, function(err, user) {
      if (err)
          return done(err);
      if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
      if (!bcrypt.compareSync(password, user.password))
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
      return done(null, user);
    });
  }));
}