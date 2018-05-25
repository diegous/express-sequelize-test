'use strict';

var expect      = require('expect.js');
var userInViews = require('../../lib/user-in-views');

describe('user-in-views middleware', function () {
  const user = 'a user';

  // Middleware params
  let req, res, next

  // '#render' params
  const name = 'template name';
  const callback = function () {};
  let options;

  beforeEach(function () {
    req = { user: user };
    next = function () {};

    options = {};
  });

  it("calls the 'next' function", function (done) {
    next = function() {
      // This is just to test that the 'next' function is called
      expect(1).to.equal(1);
      done();
    };

    res = { render: {} };

    userInViews(req, res, next);
  });

  it("adds a user value when options without a user are given", function (done) {
    const render = function (name, options, callback) {
      expect(options.currentUser).to.equal(user);
      done();
    };

    res = { render: render };

    userInViews(req, res, next);
    res.render(name, options, callback);
  });

  it("replaces the value when options with a user are given", function (done) {
    const render = function (name, options, callback) {
      expect(options.currentUser).to.equal(user);
      done();
    };

    res = { render: render };
    options = { currentUser: 'a different user' };

    userInViews(req, res, next);
    res.render(name, options, callback);
  });

  it("adds an 'options' object whith the user when no options are given", function (done) {
    const render = function (name, options, cb) {
      expect(options.currentUser).to.equal(user);
      expect(cb).to.equal(callback);
      done();
    };

    res = { render: render };

    userInViews(req, res, next);
    res.render(name, callback);
  });

  it("adds 'undefined' as the user when there is no user in the request", function (done) {
    const render = function (name, options, callback) {
      expect(options.currentUser).to.equal(undefined);
      done();
    };

    req = {};
    res = { render: render };

    userInViews(req, res, next);
    res.render(name, callback);
  });
});
