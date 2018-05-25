var models         = require('../models');
var LocalStrategy  = require('passport-local').Strategy;

function passportConfig (passport) {
  passport.use(new LocalStrategy((username, password, done) => {
    models.User.findOne({ where: { username: username } }).then(user => {
      if (user && user.verifyPassword(password)) {
        return done(null, user);
      }
      return done(null, false);
    }).catch(function(err) {
      done(err);
    });
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id)
  });

  passport.deserializeUser(function (id, done) {
    models.User.findById(id).then(user => {
      done(null, user.get());
    }).catch(err => {
      done(err, null);
    });
  });
}

module.exports = passportConfig
