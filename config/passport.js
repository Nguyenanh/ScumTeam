// load all the things we need
var LocalStrategy   = require('passport-local').Strategy,
    Mogodb  = require('../mongodb/connection'),
    US = require('../model/users'),
    bcrypt   = require('bcrypt-nodejs');
module.exports = function(passport) {
  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    US.getUser(id, function(err, user) {
        done(err, user);
    });
  });
  passport.use('local-register', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) {
      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(function() {
      US.checkAlreadyUser(username, function(err, user) {
        if (err)
          return done(err);
        // check to see if theres already a user with that email
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
            console.log(resUser[0])
            return done(null, resUser[0]);
          });
        }
      });
    });
  }));
}