// This custom middleware ensures that there is a value for
// 'currentUser' in the locals for the templates. If there is a
// user logged in, it uses that user, otherwise 'undefined'

const userInViews = function(req, res, next) {
  const _render = res.render;

  res.render = function(name, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = { currentUser: req.user };
    } else {
      options.currentUser = req.user;
    }

    return _render.call(this, name, options, callback);
  }

  next();
}

module.exports = userInViews
