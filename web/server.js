const express = require('express');
const app = express();
//const passport = require('passport');
//const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const port = process.env.PORT || 3000;
const base = `${__dirname}/public`;


app.use(express.static('public'));
/*
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});*/
/*
passport.use(new GoogleStrategy({
    clientID: ,
    clientSecret:
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(accessToken);
    console.log(profile);
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login.html' }),
    function(req, res) {
      res.redirect('/register.html');
    });*/
/*app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));*/
app.get('/', function (req, res) {
res.sendFile(`${base}/device_list.html`);
});

app.listen(port, () => {
console.log(`listening on port ${port}`);
});

app.post('/register.html', function (req, res) {
  res.sendFile(`${base}/register.html`);
})

app.post('/login.html', function (req, res) {
  res.sendFile(`${base}/register.html`);
})

app.get('*', (req, res) => {
res.sendFile(`${base}/404.html`);
});
