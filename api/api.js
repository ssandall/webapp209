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




app.get('/docs', (req, res) => {
res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});





app.post('/api/auth', (req, res) => {
    console.log("hit");
    console.log(req.body);
    return res;
});



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
