// NOTES:

// https://developers.google.com/google-apps/calendar/v3/reference/
//https://fullcalendar.io/
//https://egghead.io/courses/build-your-first-react-js-application


// credentials ------------------//
var clientId = '419714143213-s3gfkgmdaj8bu0a6p2aq64arotoem9g4.apps.googleusercontent.com';
var apiKey = 'YOUR_API_KEY';
var scopes = 'https://www.googleapis.com/auth/calendar';

// authorization ----------------//
// to check that the user is logged in and to handle authorization:
function handleClientLoad() {
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkAuth,1);
  checkAuth();
}

function checkAuth() {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true},
      handleAuthResult);
}

function handleAuthResult(authResult) {
  var authorizeButton = document.getElementById('authorize-button');
  if (authResult) {
    authorizeButton.style.visibility = 'hidden';
    makeApiCall();
  } else {
    authorizeButton.style.visibility = '';
    authorizeButton.onclick = handleAuthClick;
   }
}

function handleAuthClick(event) {
  gapi.auth.authorize(
      {client_id: clientId, scope: scopes, immediate: false},
      handleAuthResult);
  return false;
}

// make a request to retrieve a list of events from the user’s primary calendar, and use the results to populate a list on the page:

function makeApiCall() {
  gapi.client.load('calendar', 'v3', function() {
    var request = gapi.client.calendar.events.list({
      'calendarId': 'primary'
    });
          
    request.execute(function(resp) {
      for (var i = 0; i < resp.items.length; i++) {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(resp.items[i].summary));
        document.getElementById('events').appendChild(li);
      }
    });
  });
}