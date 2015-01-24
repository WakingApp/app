/**
 * Module dependencies
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    cons = require('consolidate'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    session = require('express-session'),
    calendar = require('./lib/calendar');

calendar.setUpGoogleAuth();

var app = module.exports = express();

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.engine('html', cons.nunjucks);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(app.router);

app.get('/:name', function(req, res) {
    res.render(req.params.name);
})

app.get('/', calendar.authenticate, function(req, res) {
    res.render('index');
});

app.get('/calendar/success', calendar.ensureAuthenticated, function(req, res) {
    res.redirect('/calendar/search');
});

app.get('/calendar/fail', function(req, res) {
    res.send('fail');
});

app.get('/calendar/search', calendar.watch);

app.get('/calendar/watch', function(req,res) {
	res.sent('hello');

});

app.get('/calendar/oauth2callback', calendar.authenticate, function(req, res) {
    console.log(req.isAuthenticated());
    console.log('authenticated');
    res.send('success');
})

app.listen(3000);
