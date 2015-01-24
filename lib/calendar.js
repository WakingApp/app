var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var gcal = require('google-calendar');
var config = require('./../config.js');
var google_calendar;
var email;

exports.authenticate = passport.authenticate('google', {
    successRedirect: '/calendar/success',
    failureRedirect: '/calendar/fail'
});

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

exports.setUpGoogleAuth = function() {
    passport.use(new GoogleStrategy({
            clientID: config.client_id,
            clientSecret: config.consumer_secret,
            callbackURL: "http://localhost:3000/calendar/oauth2callback",
            scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar']
        },
        function(accessToken, refreshToken, profile, done) {

            google_calendar = new gcal.GoogleCalendar(accessToken);
            email = profile.emails[0].value
            console.log(email);
            return done(null, profile);
        }
    ));
}

exports.searchCalendar = function(req, res) {
    if (!google_calendar) {
        res.redirect('/calendar/fail');
        return;
    }
    google_calendar.events.list(email, function(err, calendarList) {
        console.log(calendarList);
    });

}

exports.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.send('ensure authenticated: ' + req.isAuthenticated());
}
