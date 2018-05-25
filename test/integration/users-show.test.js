'use strict';

var app      = require('../../app');
var Bluebird = require('bluebird');
var expect   = require('expect.js');
var request  = require('supertest');
const models = require('../../models');
const { authenticate } = require('../helpers')

describe('users show page', function () {
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

  it('lists the tickets for the user if available', function (done) {
    this.models.User.create({ username: 'johndoe', password: 'abcd' }).bind(this).then(function (user) {
      return this.models.Task.create({ title: 'johndoe task', UserId: user.id });
    }).then(function (task) {
      authenticatedUser
        .get(`/users/${task.UserId}`)
        .expect(/johndoe task/, done);
    });
  });

  // Show
  it('loads show correctly', function (done) {
    this.models.User.create({ username: 'pepito', password: 'abcd' }).bind(this).then(function (user) {
      authenticatedUser
        .get(`/users/${user.id}`)
        .expect(200, done);
    })
  });

  it('show user correctly if there is one', function (done) {
    this.models.User.create({ username: 'pepito', password: 'abcd' }).bind(this).then(function (user) {
      authenticatedUser
        .get(`/users/${user.id}`)
        .expect(/pepito/, done);
    })
  });

  it('returns 404 if there is no user', function (done) {
    authenticatedUser
      .get('/users/100')
      .expect(404, done);
  });

  it('returns \'User not found\' if there is no user', function (done) {
    authenticatedUser
      .get('/users/100')
      .expect(/User not found/, done);
  });
});
