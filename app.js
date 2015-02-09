var config = require('lib/config');
var express = require('express')
  , app = express()
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , GoogleSpreadsheet = require("google-spreadsheet");

var gsheet = new GoogleSpreadsheet('1IxKQqDlZHdV9Xm-ksRe7U6f-z4W7O16h8PgfA98E-HI');

//Make our db accessible to our router
app.use(function(req, res, next){
    req.gsheet = gsheet;
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var session = require('express-session')
  , RedisStore = require('connect-redis')(session);

app.use(session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  store: new RedisStore({ url: process.env.REDISCLOUD_URL })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(require('middleware/loadUser'));

app.use('/', require('routes/index'));
app.use('/auth', require('routes/auth'));
app.use('/data', require('routes/data'));
app.use('/users', require('routes/users'));
app.use('/shipment', require('routes/shipment'));
app.use('/company', require('routes/company'));
app.use('/api', require('routes/api'));

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

//module.exports = app;

var port = process.env.PORT || config.get('port');
app.listen(port, function () {
    console.log('Express server listening on port ' + port);
});
