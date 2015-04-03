var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var routes = require('./routes/index');
var users = require('./routes/users');
var groups = require('./routes/groups');

var middleware_helper = require('./config/middlewares/helper')
var middleware_current_user = require('./config/middlewares/current_user')
var middleware_alert = require('./config/middlewares/alert')

var app = express();

var session = require('express-session')
var FileStore = require('session-file-store')(session);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());

app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: 'share_out_GJSDAFJIASDFASIDJ12349871zSADFASDF12398905',
  cookie: { maxAge: 6*60*60000 }, // 6 hours
  store: new FileStore({
    reapInterval: 3*60*60 // in seconds, 3 hours
  })
}))

app.use(middleware_helper)
app.use(middleware_current_user)
app.use(middleware_alert)

app.use('/', routes);
app.use('/users', users);
app.use('/groups', groups);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
