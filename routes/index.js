var models   = require('../models');
var express  = require('express');
var router   = express.Router();
var passport = require('passport');

router.get('/', function(req, res) {
  models.User.findAll({
    include: [ models.Task ]
  }).then(function(users) {
    res.render('index', {
      title: 'Sequelize: Express Example',
      users: users,
      user: req.user
    });
  });
});

module.exports = router;
