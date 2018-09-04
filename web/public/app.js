const users = JSON.parse(localStorage.getItem('users')) || [];
const API_URL = 'https://217349255-sit-209.now.sh/api';
const MQTT_URL = 'http://localhost:5001/send-command';


const currentUser = localStorage.getItem('name');

/*
const app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});*/
/*

const passport = require("passport");

module.exports = app => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );

  app.get("/auth/google/callback", passport.authenticate("google"));
};

*/


// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.




if (currentUser) {
  $.get(`${API_URL}/users/${currentUser}/devices`)
  .then(response => {
    response.forEach((device) => {
      $('#devices tbody').append(`
        <tr data-device-id=${device._id}>
        <td>${device.user}</td>
        <td>${device.name}</td>
        </tr>`
      );


    });
    $('#devices tbody tr').on('click', (e) => {

      const deviceId = e.currentTarget.getAttribute('data-device-id');
        console.log("clicked");
        console.log("deviceId is: ", deviceId);

      $.get(`${API_URL}/devices/${deviceId}/device_history`)
      .then(response => {
        console.log("from app js sensorData is: ", response);
        response.map(sensorData => {

          console.log("var ", sensorData);
          $('#historyContent').append(`
            <tr>
            <td>${sensorData.ts}</td>
            <td>${sensorData.temp}</td>
            <td>${sensorData.loc.lat}</td>
            <td>${sensorData.loc.lon}</td>
            </tr>
            `);
          });
          $('#historyModal').modal('show');
        });
      });
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
  }
  /*
  else
  {
  const path = window.location.pathname;
  if (path !== '/login.html') {
  location.href = '/login.html';
}
}*/


$('#add-device').on('click', () => {
  const name = $('#name').val();
  const user = $('#user').val();
  const sensorData = [];
  const body = {
    name,
    user,
    sensorData
  };
  $.post(`${API_URL}/devices`, body)
  .then(response => {
    location.href = '/';
  })
  .catch(error => {
    console.error(`Error: ${error}`);
  });
});
/*
app.post('/send-command', (req, res) => {
  const { deviceId, command } = req.body;
  const topic = `/command/${deviceId}`;
  client.publish(topic, command, () => {
    res.send(topic);
  });
});*/
$('#send-command').on('click', function() {
  const command = $('#command').val();
  const deviceId = $('#device').val();
  const body = {
    deviceId,
    command
  };
  console.log(`command is: ${command}`);
  console.log(`device is: ${deviceId}`);
  $.post(`${MQTT_URL}`, body )
  .then(response => {
    console.log("it worked");
  })
  .catch(error => {
    console.error(`error`);
  });
});

$('#navbar').load('navbar.html');

$('#footer').load('footer.html');


$('#submit_registration').on('click', () => {

  const name = $('#email_address').val();
  const password = $('#password').val();
  const confirm = $('#confirm').val();

  if(password.localeCompare(confirm) != 0)
  {
    alert("passwords don't match");
  }
  else {


    $.post(`${API_URL}/register`, { name, password })
    .then((response) =>{
      console.log(response);
      if (response.success) {

        $('#message').append(`<p class="alert alert-danger">Successful registration!</p>`);
        //localStorage.setItem('name', name);
        //localStorage.setItem('isAdmin', response.isAdmin);
        //location.href = '/';
      } else {
        $('#message').append(`<p class="alert alert-danger">${response}
        </p>`);
      }
    });
  }
});




$('#submit_login').on('click', () => {
  const name = $('#email_address').val();
  const password = $('#password').val();
  //  console.log(user);
  //  console.log(password);

  $.post(`${API_URL}/authenticate`, { name, password })
  .then((response) =>{
    console.log(response);
    if (response.success) {
      localStorage.setItem('name', name);
      localStorage.setItem('isAdmin', response.isAdmin);
      localStorage.setItem('isAuthenticated', true);
      location.href = '/';
    } else {
      $('#message').append(`<p class="alert alert-danger">${response}
      </p>`);
    }
  });
});


const logout = () => {
  localStorage.removeItem('name');
  localStorage.removeItem('isAdmin');
  localStorage.isAuthenticated = false;
  location.href = '/login.html';
}


/*
$.get(`${API_URL}/devices`)
.then(response => {
response.forEach(device => {
$('#devices tbody').append(`
<tr>
<td>${device.user}</td>
<td>${device.name}</td>
</tr>`
);
});
})
.catch(error => {
console.error(`Error: ${error}`);
});
*/

/*
devices.forEach(function(device) {
$('#devices tbody').append(`
<tr>
<td>${device.user}</td>
<td>${device.name}</td>
</tr>`
);
});
*/

/*
$('#add-device').on('click', function() {
const user = $('#user').val();
const name = $('#name').val();
devices.push({ user, name });
localStorage.setItem('devices', JSON.stringify(devices));
location.href = '/';
});
*/

/*
$.get('http://localhost:3001/devices')
.then(response => {
console.log(response);
})
.catch(error => {
console.log(`Error: ${error}`);
});
*/

/*
$('#submit_registration').on('click', function() {

const email = $('#email_address').val();
const password = $('#password').val();
const confirm = $('#confirm').val();

console.log(email);
console.log(password);
console.log(confirm);

const exists = users.find((user) => {

return user.email === email;

});

if(exists)
{
alert("email already exists!");
}
else
{
if(password.localeCompare(confirm) === 0)
{
users.push({email, password});
localStorage.setItem('users', JSON.stringify(users));
location.href = 'login.html';
}
else
{
alert("passwords do not match!");
}
}


});
*/



/*
$('#submit_login').on('click', function() {

const email = $('#email_address').val();
const password = $('#password').val();
var userObj = {};

console.log(email);

const exists = users.find((user) => {

userObj = user;
return user.email === email;

});

if(!exists)
{
alert("The user doesn't exist!");
}
else
{

const localUserPwd = userObj.password;

if(localUserPwd.localeCompare(password) === 0)
{
localStorage.setItem('isAuthenticated', true);
location.href = '/';
}
else
{

alert("The password is incorrect!");

}
}

});
*/


var map;
/* mobilityArray is the alcoholArray and is the older people*/
var mobilityArray = [];

/* mobilityMarkers is the mobility marker (acohol) */

var mobilityMarkers = [];


var countMobilitySelected = 0;


function addMobilityMarkerFirstTime() {


  console.log(mobilityArray.length);

  for (i = 0; i < mobilityArray.length; i++) {

    var latFloat, lngFloat;
    latFloat = parseFloat(mobilityArray[i]["lat"]);
    lngFloat = parseFloat(mobilityArray[i]["lng"]);

    console.log(latFloat);
    console.log(lngFloat);

    var marker_position = {lat: latFloat, lng: lngFloat};
    var marker = new google.maps.Marker({
      position: marker_position,
      map: map,
      icon: 'images/personicon.png',
      customData: mobilityArray[i]
    });

    mobilityMarkers.push(marker);

    marker.addListener('click', function() {

      open_pop_up(this.customData);
    });

  }
}

function updateMapMarker(location)
{
  var latFloat, lngFloat;
  latFloat = parseFloat(location.lat);
  lngFloat = parseFloat(location.lng);

  console.log(latFloat);
  console.log(lngFloat);

  var marker_position = {lat: latFloat, lng: lngFloat};
  var marker = new google.maps.Marker({
    position: marker_position,
    map: map,
    icon: 'images/personicon.png',
    customData: mobilityArray[mobilityArray.length]
  });

  mobilityMarkers.push(marker);

  marker.addListener('click', function() {

    open_pop_up(this.customData);
  });
}

function open_pop_up(mobility_object){


  var open_pop = document.getElementById('pop_up');
  open_pop.style.display = 'block';
  var text_name = document.getElementById("personName");
  text_name.innerHTML = mobility_object["uid"];


}

function close_pop_up(){

  var close_pop = document.getElementById('pop_up');
  close_pop.style.display = 'none';
}


function readInMobility()
{
  db.collection("data").get().then((querySnapshot) => {

    querySnapshot.forEach((doc) => {

      mobilityArray.push(doc.data());

    });

    addMobilityMarkerFirstTime();
  });
}

function deleteMarker(){

    if(mobilityMarkers.length != 0)
    {
      for (i = 0; i < mobilityMarkers.length; i++) {

        mobilityMarkers[i].setMap(null);

     }

      mobilityMarkers.length = 0;
    }
}
