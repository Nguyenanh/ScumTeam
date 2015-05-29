// load all the things we need
var LocalStrategy   = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    Mogodb  = require('../mongodb/connection'),
    US = require('../model/users'),
    bcrypt   = require('bcrypt-nodejs');
var configAuth = require('./auth');

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
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      US.checkAlreadyUserEmail(email, function(err, user) {
        if (err)
          return done(err);
        if (user) {
            return done(null, false, req.flash('signupErrors', 'That email is already taken.'));
        } else {
          var document = {
           firstname : req.param('first_name'),
           lastname : req.param('last_name'),
           username : req.param('username'),
           email : req.param('email'),
           password : bcrypt.hashSync(req.param('password'), bcrypt.genSaltSync(8), null),
           avatar : "http://localhost:3000/uploads/images/default.jpg",
           project_ids :[],
           provider: 'local',
          }
          US.insertUser(document, function(errUser, resUser) {
            return done(null, resUser[0]);
          });
        }
      });
    });
  }));
  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    US.getEmail(email, function(err, user) {
      if (err)
          return done(err);
      if (!user)
          return done(null, false, req.flash('loginMessage', 'No email found.')); // req.flash is the way to set flashdata using connect-flash
      if (!bcrypt.compareSync(password, user.password))
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
      return done(null, user);
    });
  }));
  /*-------------------- Login Facebook --------------------*/
   passport.use(new FacebookStrategy({
        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields : ['id', 'displayName', 'name', 'gender', 'emails','photos']
    },
    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
      console.log("anhh");
      console.log(profile);
        process.nextTick(function() {
            // find the user in the database based on their facebook id
          US.getUserFacebook(profile.id, function(err, user) {

              if (err)
                  return done(err);

              // if the user is found, then log them in
              if (user) {
                  return done(null, user); // user found, return that user
              } else {
                  // if there is no user found with that facebook id, create them
                  var document = {
                    facebook : {
                      id : profile.id,
                    },
                    firstname : profile.name.givenName,
                    lastname : profile.name.familyName,
                    email : profile.emails[0].value,
                    avatar : profile.photos[0].value,
                    project_ids :[],
                    provider: 'facebook',

                  }
                  if(profile.username) {
                    document.username = profile.username;
                  }else {
                    document.username = profile.displayName;
                  }
                US.insertUser(document, function(erruser, newUser){
                  return done(null, newUser[0]);
                })
              }

            });
        });
    }));
}