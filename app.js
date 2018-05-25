var authRedirect   = require('./lib/auth-redirect');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var express        = require('express');
var ejsLayouts     = require('express-ejs-layouts');
var favicon        = require('serve-favicon');
var flash          = require('connect-flash');
var logger         = require('morgan');
var path           = require('path');
var passport       = require('passport');
var passportConfig = require('./config/passport');
var userInViews    = require('./lib/user-in-views');

// Routers
var routes  = require('./routes/index');
var session = require('./routes/session');
var users   = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Passport configuration
passportConfig(passport);

// Middlewares
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(userInViews);
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(ejsLayouts);
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', session);
app.use('/', authRedirect); // Every route beyond this point must be authenticated
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler for 404
app.use(function(err, req, res, next) {
  if (err.status === 404) {
    res.status(404);
    res.render('404', { error: err });
  } else {
    next(err);
  }
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  });
});


module.exports = app;
