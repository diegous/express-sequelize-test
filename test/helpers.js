var expect   = require('expect.js');

// I'm not sure if bringing this code here is a good idea
const authenticate = function (models, user, credentials, done) {
  models.sequelize.sync().then(function () {
    models.User.findOrCreate({ where: credentials }).then(function () {
      user
        .post('/login')
        .send(credentials)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.header.location).to.equal('/');
          done();
        });
    });
  });
}

module.exports = { authenticate: authenticate }
