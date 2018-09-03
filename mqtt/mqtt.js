const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Device = require('./models/device');
//const randomCoordinates = require('random-coordinates');
//const rand = require ('random-int');

const app = express();
const { URL, USER, PASSWORD } = process.env;
const port = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.connect(process.env.MONGO_URL);
//app.use(express.static(`${__dirname}`));

const client = mqtt.connect(URL, {
  username: USER,
  password: PASSWORD
});


client.on('connect', () => {
    client.subscribe('/map');
    console.log('mqtt connected');
});

/**
* @api {client} /message looks for user by name
* @apiDocs
* @apiSuccessExample {html} Success-Response:
*
* list of deivices seen in webapp
*
* @apiErrorExample {html} Error-Response:
*
*    404 error
*
*
*/

client.on('message', (topic, message) => {
  console.log("published");
  const data = JSON.parse(message);
  console.log("data is, ", data);
  /*
  if (topic == '/sensorData') {
    const data = JSON.parse(message);
    console.log("data is, ", data);
    console.log("device id is: ", data.deviceId)
    Device.findOne({"name": data.deviceId }, (err, device) => {
      console.log("the device si: ", device);
      if (err) {
        console.log(err)
      }
      const { sensorData } = device;
      const { ts, loc, temp } = data;
      sensorData.push({ ts, loc, temp });
      device.sensorData = sensorData;
      device.save(err => {
        if (err) {
          console.log(err)
        }
      });
    });
  }*/
});

/**
* @api {put} /sensorData adding sensor data to mongobd
* @apiDocs
* @apiSuccessExample {html} Success-Response:
*
* list of deivices seen in webapp
*
* @apiErrorExample {html} Error-Response:
*
*    404 error
*
*
*/
/*
app.put('/sensor-data', (req, res) => {
  console.log("does this work?");
  console.log(req.body);
  const { deviceId } = req.body;
  const [lat, lon] = randomCoordinates().split(", ");
  const ts = new Date().getTime();
  const loc = { lat, lon };
  const temp = rand(20, 50);
  const topic = `/sensorData`;
  const message = JSON.stringify({ deviceId, ts, loc, temp });
  console.log(message);
  client.publish(topic, message, () => {
    res.send('published new message');
  });
});
*/
/*
app.post('/send-command', (req, res) => {
  const { deviceId, command } = req.body;
  const topic = `/command/${deviceId}`;
  console.log("did this get here");
  client.publish(topic, command, () => {
    res.send(topic);
  });
});
*/
app.listen(port, () => {
  console.log(`listening on port ${port}`);
//  console.log("published");
});
