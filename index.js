var express = require('express');
var session = require('express-session');
var passport = require('passport');
var passportFacebook = require('passport-facebook').Strategy;
var keys = require('./keys');

var app = express();

app.use(session({secret: 'some-random-string'}))

app.use(passport.initialize())

app.use(passport.session())

passport.use(new passportFacebook({
  clientID: keys.facebookKey,
  clientSecret: keys.facebookSecret,
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, function(token, refreshToken, profile, done) {
  return done(null, profile);
}));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect:'/me',
    failureRedirect:'/'
}));

passport.serializeUser(function(profile, done) {
  done(null, profile);
});

passport.deserializeUser(function(deserializeUser, done) {
  done(null, deserializeUser);
});

app.get('/me', function(req, res, next){
    res.send(req.user);
});

app.listen(3000, function(){
  console.log('listening');
});
