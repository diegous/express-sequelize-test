var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.post('/create', function(req, res) {
  models.User.create({
    username: req.body.username
  }).then(function() {
    res.redirect('/');
  });
});

router.get('/:user_id/destroy', function(req, res) {
  models.User.destroy({
    where: {
      id: req.params.user_id
    }
  }).then(function() {
    res.redirect('/');
  });
});

router.post('/:user_id/tasks/create', function (req, res) {
  models.Task.create({
    title: req.body.title,
    UserId: req.params.user_id
  }).then(function() {
    res.redirect('/');
  });
});

router.get('/:user_id/tasks/:task_id/destroy', function (req, res) {
  models.Task.destroy({
    where: {
      id: req.params.task_id
    }
  }).then(function() {
    res.redirect('/');
  });
});

router.get('/', function (req, res) {
  models.User
    .findAll()
    .then(users => {
      res.render('users/index.pug', {
        title: 'Users',
        users: users
      });
    });
});

router.get('/:user_id', function (req, res, next) {
  models.User.findOne({
    include: [ models.Task ],
    where: {
      id: req.params.user_id
    }
  }).then(user => {
    if (!user) return notFound('User', next);

    res.render('users/show.pug', {
      user: user
    });
  });
});

notFound = (model, next) => next();

module.exports = router;
