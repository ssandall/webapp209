const express = require('express');
const app = express();
const mqtt = require('mqtt');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const  io = require('socket.io')(server);


//server.listen(3000);
//const passport = require('passport');
//const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
server.listen(3000);


const { URL, USER, PASSWORD } = process.env;
const port = process.env.PORT || 3000;
const base = `${__dirname}/public`;



app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//io.on('connection', function(){ console.log("sockests connected"); });


io.on('connection', function(socket){
  console.log("io connected");
  socket.emit('request', console.log("emitted")); // emit an event to the socket
  io.emit('broadcast', /* */); // emit an event to all connected sockets
  socket.on('reply', function(){ /* */ }); // listen to the event
});

const client = mqtt.connect(URL, {
  username: USER,
  password: PASSWORD
});

client.on('connect', () => {
    client.subscribe('/map');
    console.log('mqtt connected from web');
});


client.on('message', (topic, message) => {
  console.log("published from web");
  const data = JSON.parse(message);
  console.log("data is, ", data);
  //io.on('connect', onConnect, data);
  io.sockets.on('connection', function(socket){
    socket.emit('location', data);
  });


});


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
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
/*
app.listen(port, (req, res) => {

console.log(`listening on port ${port}`);
});
*/
app.post('/register.html', function (req, res) {
  res.sendFile(`${base}/register.html`);
})

app.post('/login.html', function (req, res) {
  res.sendFile(`${base}/register.html`);
})

app.get('*', (req, res) => {
res.sendFile(`${base}/404.html`);
});
