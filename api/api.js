const express = require('express');
const mongoose = require('mongoose');
const Device = require('./models/device');
const User = require('./models/user');
const bodyParser = require('body-parser');
//const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const app = express();
const port = process.env.PORT || 5000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.connect(process.env.MONGO_URL);

app.use(express.static(`${__dirname}/public`));
/*
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENTSECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
       User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, user);
       });
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login.html' }),
    function(req, res) {
      res.redirect('/register.html');
    });
*/

/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiDocs
* @apiSuccessExample {html} Success-Response:
*
* docs visible at index.html
*
* @apiErrorExample {html} Error-Response:
*
*    404 error
*
*
*/

app.get('/docs', (req, res) => {
res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});


/**
* @api {post} /api/register Registering a user
* @apiRegister
* @apiSuccessExample {json} Success-Response:
*   {
*    success: true,
*    message: 'Created new user'
*   }
* @apiErrorExample {json} Error-Response:
*   {
*     success: false,
      message: err
*   }
*/

app.post('/api/register', (req, res) => {

  const {name, password, isAdmin} = req.body;
  console.log(req.body);

  User.findOne({ 'name': name }, function (err, user) {

    if(err!=null)
    {

      return res.json({
        success: false,
        message: err
      });
      //return err
    }
    else
    {
      if(user!=null)
      {

        return res.json({
          success: false,
          message: "user already exists"
        });
        console.log("user already exists");
      }
      else
      {

        console.log(req.body);
        console.log("create new user");

        const newUser = new User({
          name,
          password,
          isAdmin
        });

        newUser.save(err => {
          return err
          ? res.send(err)
          : res.json({
            success: true,
            message: 'Created new user'
          });
        });
      }
    }
  });
});

/**
* @api {post} /api/authenticate Authenticating a user at login
* @apiAuthenticate
* @apiSuccessExample {json} Success-Response:
*   {
*  success: true,
*  message: 'Authenticated successfully',
*  isAdmin: user.isAdmin
* }
*@apiErrorExample {text} Error-Response:
* {
*     "password is incorrect try again"
* }
*@apiErrorExample {text} Error-Response:
* {
*     "no user exists"
* }
*/

app.post('/api/authenticate', (req, res) => {

  const {name, password} = req.body;
  console.log('the user and body and stuff', req.body);
  console.log('name is: ', name);
  console.log('password is: ', password);

  User.findOne({ 'name': name }, function (err, user) {

    if(err!=null)
    {
      return err
    }
    else
    {
      if(user!=null)
      {
        if(password.localeCompare(user.password) === 0)
        {
          return res.json({
            success: true,
            message: 'Authenticated successfully',
            isAdmin: user.isAdmin
          });
        }
        else
        {
          //alert("password is incorrect. try again");
          console.log("password is incorrect, try again");
        }
      }
      else
      {

        console.log("no user exists");
        //alert("no user with that name exists");
      }
    }
  });
});

/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
* [
* {
* "_id": "dsohsdohsdofhsofhosfhsofh",
* "name": "Mary's iPhone",
* "user": "mary",
* "sensorData": [
* {
* "ts": "1529542230",
* "temp": 12,
* "loc": {
* "lat": -37.84674,
* "lon": 145.115113
* }
* },
* {
* "ts": "1529572230",
* "temp": 17,
* "loc": {
* "lat": -37.850026,
* "lon": 145.117683
* }
* @apiErrorExample {json} Error-Response:
*
*
*   404 error
*
*/

app.get('/api/devices', (req, res) => {
  Device.find({}, (err, devices) => {
    return err
    ? res.send(err)
    : res.send(devices);
  });
});

/**
* @api {post} /api/devices post devices to mongodb
* @apipostDevice
* @apiSuccessExample {json} Success-Response:
*{
*      "Succesfully added device and data"
* }
* @apiErrorExample {json} Error-Response:
* {
*      404 error
* }
*/

app.post('/api/devices', (req, res) => {
  const { name, user, sensorData } = req.body;
  const newDevice = new Device({
    name,
    user,
    sensorData
  });
  newDevice.save(err => {
    return err
    ? res.send(err)
    : res.send('successfully added device and data');
  });
});

/**
* @api {get} /api/send_command implementing sending a command to a device
* @apiSendCommand
* @apiSuccessExample Success-Response:
* The req.body.command is logged to the console
*/
/*
app.post('/api/send_command', (req, res) => {

  console.log(req.body.command);

});
*/
/**
* @api {get} /api/devices/:deviceId/device_history AllDevices An array of all devices for a given id
* @apiDeviceHistoryForId
* @apiSuccessExample {json} Success-Response:
* [
* {
* "_id": "dsohsdohsdofhsofhosfhsofh",
* "name": "Mary's iPhone",
* "user": "mary",
* "sensorData": [
* {
* "ts": "1529542230",
* "temp": 12,
* "loc": {
* "lat": -37.84674,
* "lon": 145.115113
* }
* },
* {
* "ts": "1529572230",
* "temp": 17,
* "loc": {
* "lat": -37.850026,
* "lon": 145.117683
* }
* @apiErrorExample {json} Error-Response:
* {
*      404 error
* }
*/

app.get('/api/devices/:deviceId/device_history', (req, res) => {
  const { deviceId } = req.params;
  console.log("did we get here");
  console.log("api device Id is: ", deviceId);
  Device.findOne({"_id": deviceId }, (err, devices) => {
    //console.log(devices);
    const { sensorData } = devices;
    console.log(sensorData);
    return err
    ? res.send(err)
    : res.send(sensorData);
  });
});

/**
* @api {get} /api/users/:user/devices AllDevices An array of all devices for a user
* @apiAllUserDevices
* @apiSuccessExample {json} Success-Response:
* { sensorData: [ { ts: '1529545935', temp: 14, loc: [Object] } ],
*  _id: 5b593e61cb4de92771a3334c,
*  name: 'Bob\'s Samsung Galaxy',
*  user: 'bob',
*  id: '4' }
* }
* @apiErrorExample {json} Error-Response:
* {
*      404 error
* }
*/

app.get('/api/users/:user/devices', (req, res) => {
  const { user } = req.params;
  Device.find({ "user": user }, (err, devices) => {
    return err
    ? res.send(err)
    : res.send(devices);
  });
});

/**
* @api {get} /api/test Testing the api is working
* @apiTest
* @apiSuccessExample Success-Response:
* "The api is working!" printed to the console
*/

app.get('/api/test', (req, res) => {
  res.send('The API is working!');

});

/*
app.post('/api/map', (req, res) =>
{

}*/


app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
