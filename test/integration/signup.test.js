'use strict';

var app      = require('../../app');
var Bluebird = require('bluebird');
var expect   = require('expect.js');
var request  = require('supertest');
const models = require('../../models');
const { authenticate } = require('../helpers')

describe('signup page', function () {
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

  it('displays the signup form', function (done) {
    request(app)
      .get('/signup')
      .expect(200)
      .expect(/Create new user account/, done)
  });

  it('redirects to homepage if there is a user alreadly logged in', function (done) {
    authenticatedUser
      .get('/signup')
      .expect(302)
      .expect('Location', '/', done)
  });

  it('creates a new user when valid username/password combination is submitted', function (done) {
    request(app)
      .post('/signup')
      .send({ username: 'orangel', password: '1234' })
      .end(function (err, res) {
        models.User.findOne({
          where: { username: 'orangel' }
        }).then(user => {
          expect(user.password).to.equal('1234');
          done();
        });
      });
  });

  it('does not create a new user if username is missing', function (done) {
    request(app)
      .post('/signup')
      .send({ password: 'a password' })
      .expect(/username cannot be null/)
      .expect(200, done)
  });

  it('does not create a new user if password is missing', function (done) {
    request(app)
      .post('/signup')
      .send({ username: 'a username' })
      .expect(/password cannot be null/)
      .expect(200, done)
  });

  it('does not create a new user if username is empty', function (done) {
    request(app)
      .post('/signup')
      .send({ username: '', password: 'a password' })
      .expect(/Validation notEmpty failed: username/)
      .expect(200, done)
  });

  it('does not create a new user if password is empty', function (done) {
    request(app)
      .post('/signup')
      .send({ username: 'a username', password: '' })
      .expect(/Validation notEmpty failed: password/)
      .expect(200, done)
  });

  it('does not create a new user if the username is taken', function (done) {
    let username = 'pepito';

    this.models.User.create({ username: username, password: 'abcd' }).then(function () {
      request(app)
        .post('/signup')
        .send({ username: username, password: 'a password' })
        .expect(/username must be unique: username/)
        .expect(200, done)
    })
  });
});
