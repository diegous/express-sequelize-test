'use strict';

var app      = require('../../app');
var Bluebird = require('bluebird');
var expect   = require('expect.js');
var request  = require('supertest');
const models = require('../../models');
const { authenticate } = require('../helpers')

describe('index page', function () {
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

  // Index
  it('loads index correctly', function (done) {
    authenticatedUser
      .get('/')
      .expect(200, done);
  });

  it('redirects to login if user did not sign in', function (done) {
    request(app)
      .get('/')
      .expect(302)
      .expect('Location', '/login', done)
  });
});
