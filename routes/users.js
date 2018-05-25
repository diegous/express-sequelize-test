var models  = require('../models');
var express = require('express');
var router  = express.Router();

// Users
// Index
router.get('/', function (req, res) {
  models.User
    .findAll()
    .then(users => {
      res.render('users/index', {
        title: 'Users',
        users: users
      });
    });
});

// Show
router.get('/:user_id', function (req, res, next) {
  models.User.findOne({
    include: [ models.Task ],
    where: {
      id: req.params.user_id
    }
  }).then(user => {
    if (!user) return notFound('User', next);
    res.render('users/show', {
      user: user
    });
  });
});

// Delete
router.get('/:user_id/destroy', function(req, res) {
  models.User.destroy({
    where: {
      id: req.params.user_id
    }
  }).then(function() {
    res.redirect('/');
  });
});


// User Tasks
// Create
router.post('/:user_id/tasks/create', function (req, res) {
  models.Task.create({
    title: req.body.title,
    UserId: req.params.user_id
  }).then(function() {
    res.redirect(`/users/${req.params.user_id}`);
  });
});

// Delete
router.get('/:user_id/tasks/:task_id/destroy', function (req, res) {
  models.Task.destroy({
    where: {
      id: req.params.task_id
    }
  }).then(function() {
    res.redirect(`/users/${req.params.user_id}`);
  });
});

notFound = (model, next) => next({ model: model, status: 404 });

module.exports = router;
