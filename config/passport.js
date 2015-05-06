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
  /*----------------Auth Facebok ------------------------*/
  passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
        process.nextTick(function() {
          console.log(profile);
            // find the user in the database based on their facebook id
            // US.findOne({ 'facebook.id' : profile.id }, function(err, user) {

            //     // if there is an error, stop everything and return that
            //     // ie an error connecting to the database
            //     if (err)
            //         return done(err);

            //     // if the user is found, then log them in
            //     if (user) {
            //         return done(null, user); // user found, return that user
            //     } else {
            //         // if there is no user found with that facebook id, create them
            //         var newUser            = new User();

            //         // set all of the facebook information in our user model
            //         newUser.facebook.id    = profile.id; // set the users facebook id                   
            //         newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
            //         newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
            //         newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

            //         // save our user to the database
            //         newUser.save(function(err) {
            //             if (err)
            //                 throw err;

            //             // if successful, return the new user
            //             return done(null, newUser);
            //         });
            //     }

            // });
        });

    }));



}