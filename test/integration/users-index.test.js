'use strict';

var app      = require('../../app');
var Bluebird = require('bluebird');
var expect   = require('expect.js');
var request  = require('supertest');
const models = require('../../models');
const { authenticate } = require('../helpers')

describe('users index page', function () {
  const credentials = { username: 'admin', password: 'abcd' };
  let authenticatedUser = request.agent(app);

  before(function (done) {
    authenticate(models, authenticatedUser, credentials, done);
  });

  beforeEach(function () {
    this.models = models;

    return Bluebird.all([
      this.models.Task.destroy({ truncate: true }),
      this.models.User.destroy({
        where: { username: { $ne: credentials.username } }
      })
    ]);
  });

  it('lists a user if there is one', function (done) {
    let regexp = RegExp(credentials.username);

    authenticatedUser
      .get('/users')
      .expect(regexp, done);
  });

  it('lists a new user if it was created', function (done) {
    this.models.User.create({ username: 'johndoe', password: 'abcd' }).then(function () {
      authenticatedUser
        .get('/users')
        .expect(/johndoe/, done);
    });
  });
});
