const API_URL = 'https://217349255-sit-209.now.sh/api';
const MQTT_URL = 'http://localhost:5001/send-command';


$('#navbar').load('navbar.html');

$('#footer').load('footer.html');

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


function onSignIn(googleUser) {

  const id_token = googleUser.getAuthResponse().id_token;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/auth');
  console.log('posted');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    console.log('Signed in as: ' + xhr.responseText);
  };
  xhr.send('idtoken=' + id_token);

  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

//  window.location.href = 'http://localhost:3000/map.html';

}
