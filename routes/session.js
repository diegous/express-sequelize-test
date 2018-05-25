var express  = require('express');
var models   = require('../models');
var passport = require('passport');
var router   = express.Router();

router.get('/login', function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  res.render('partials/login', {
    message: req.flash('loginMessage')
  });
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function(req, res) {
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

router.get('/logout', (req, res, next) => {
  req.logout();
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

router.get('/signup', function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  res.render('partials/signup');
});

// Create user
// I moved this from the users controller because
// the '/users' routes need authorization
router.post('/signup', function(req, res, next) {
  models.User.create({
    username: req.body.username,
    password: req.body.password
  }).then(function() {
    res.redirect('/');
  }).catch(err => {
    var messages = err.errors.map(e => `${e.message}: ${e.path}`);
    res.render('partials/signup', { messages: messages });
  });
});

module.exports = router;
