var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    password: 'password',
    passRecToCallback: true
}, function(req, username, password, done) {
 User.findOne({username: 'username'}, function(err, user) {
  if(err) {
    return done(err);
  }
  if(user) {
   return done(null, false, {message: 'Такой username занят'});
  }
  var newUser = new User();
  newUser.username = username;
  newUser.password = newUser.encryptPassword(password);
  newUser.save(function(err, result) {
   if(err) {
    return done(err);
   }
   return done(null, newUser);
  });
 }); 
}
)
);




passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, username, password, done) {
    req.checkBody('username', 'Invalid username').notEmpty();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
           messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'username': username}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, {message: 'username is already in use.'});
        }
        var newUser = new User();
        newUser.username = username;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result) {
           if (err) {
               return done(err);
           }
           return done(null, newUser);
        });
    });
}));