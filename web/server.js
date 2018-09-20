const express = require('express');
const app = express();
const mqtt = require('mqtt');
const request = require('request');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const  io = require('socket.io')(server);
const {OAuth2Client} = require('google-auth-library');


const API_URL = 'https://217349255-sit-209.now.sh/api';
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



app.get('/', function (req, res) {
res.sendFile(`${base}/device_list.html`);
});
/*app.listen(port, (req, res) => {

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

app.post('/auth', function (req, res) {
  //console.log(req.body);
  console.log("works");
const token = req.body.idtoken;
const CLIENT_ID = "474899306713-i5jjpa4mg8ppbcfqcpsehn430q727epi.apps.googleusercontent.com"
const client = new OAuth2Client(CLIENT_ID);
async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "474899306713-i5jjpa4mg8ppbcfqcpsehn430q727epi.apps.googleusercontent.com",  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  const email = payload['email'];
  console.log(userid);
  console.log(email);
  sendToDb(userid);
  //res.redirect('https://217349255-sit-209.now.sh/api/auth');
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}
verify().catch(console.error);
})

function sendToDb(userid, email)
{

  console.log("here");
/*
  request.post({
     url:'https://217349255-sit-209.now.sh/api/auth', function(err, httpResponse, body) {
       console.log(err);

       if (err) {
         return console.error('upload failed:', err);
       }
       console.log('Upload successful!  Server responded with:', body);
     }
   });
*/
}
