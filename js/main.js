
$(document).ready(function() {
	// $('#authorize-button').hide();

	var listen = function(){
		// scrollTo functionality
		$('.nav-main a').on('click', function(event) {
			event.preventDefault();
			var pageToScrollTo = $(this).attr('href');
			console.log(pageToScrollTo);
			//set the speed of scroll, destination, CALl the function on the window
			$(window).scrollTo(pageToScrollTo, 300);
			//highlight current page in nav-main
			var backToTop = $(this).addClass('is-current');
		});
	}

	// go to external calendars and get events to add to test calendar (sjpw's calendar eventually) 
	var findEvents = function(){
		console.log('checking for upcoming events for Cherry Hill Tai Chi and GDI-Camden');

		var meetUpKey = '112f1c6d117217b646034221513f16';
		var meetUpName = ['cherryhill-taichi-group', 'Girl-Develop-It-Camden'];

		for (var i = meetUpName.length - 1; i >= 0; i--) {
			$.ajax({
				type: 'GET',
				url: 'https://api.meetup.com/' + meetUpName[i] + '/events?&sign=true&photo-host=public&page=1&fields=short_link&status=upcoming&_app_key=' + meetUpKey, 
				dataType: 'jsonp'

			}).done(function(response){
				// iterate over response to get the following data, 
				for (var i = response.data.length - 1; i >= 0; i--) {
					var eventStartTime = convertTimestamp(response.data[i].time);
					var eventLink = response.data[i].short_link;
					var eventName = response.data[i].name;	

 					// format the data for GCal events
 					var eventToAdd = {
						'link': eventLink,
						'summary':  eventName,
						'start': {'dateTime': eventStartTime,
									'timeZone': 'America/New_York'}

					};
 					console.log(eventToAdd);
 					return eventToAdd;

 					// addToCalendar(eventToAdd);

				}

			}).fail(function(response){
				console.log('error: ', response);
			});
		}
	}

	// source https://gist.github.com/kmaida/6045266
	function convertTimestamp(timestamp) {
	  	var d = new Date(timestamp),	// Convert the passed timestamp to milliseconds
			yyyy = d.getFullYear(),
			mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
			dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
			hh = ('0' + d.getHours()).slice(-2),
			// h = hh,
			min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
			sec = ('0' + d.getSeconds()).slice(-2),
			ampm = 'AM',
			time;
				
		if (hh > 12) {
			h = hh - 12;
			ampm = 'PM';
		} else if (hh === 12) {
			h = 12;
			ampm = 'PM';
		} else if (hh == 0) {
			h = 12;
		}
		// 2015-05-28T09:00:00 format for Google cal events
		time = yyyy + '-' + mm + '-' + dd + 'T' + hh + ':' + min + ':' + sec;
		return time;
	}

	// https://developers.google.com/google-apps/calendar/create-events
	// https://developers.google.com/google-apps/calendar/v3/reference/events/insert#examples
	var createEvent = function(){
		$.ajax({
			type: 'POST',
			url: 'https://www.googleapis.com/calendar/v3/calendars/' + testCalendarId + '/events',
			dataType: 'jsonp'

		}).done(function(response){
			console.log(response);

		}).fail(function(response){
				console.log('error: ', response);
		});



			// var request = gapi.client.calendar.events.insert({
			// 	'calendarId': 'primary',
			// 	'resource': event
			// });

			// request.execute(function(event) {
	  // 			appendPre('Event created: ' + event.htmlLink);
			// });
	}

	//---------	GOOGLE CALENDAR API----------------//

	const G_CLIENT_ID = '419714143213-dg82c6s6si9dgoe90po1tgdhpnj39hik.apps.googleusercontent.com';
	const G_API_KEY = 'AIzaSyA9QOKvd0OrCQwFDtkWD5TCYBj4nxm8ioI';
	const G_SCOPES = 'https://www.googleapis.com/auth/userinfo.profile';
	const TEST_CAL_ID = 'amyeckertprojects.com_lrij2jrn2cub096ebeh6e16r94@group.calendar.google.com';

	var signinButton = document.getElementById('signin');
    var signoutButton = document.getElementById('signout');


	//------------- LOAD RESOURCES & 0AUTH --------------//

	function handleClientLoad() {
        // Loads the client library and the auth2 library together for efficiency.
        // Loading the auth2 library is optional here since `gapi.client.init` function will load
        // it if not already loaded. Loading it upfront can save one network request.
        gapi.load('client:auth2', initClient);
        console.log('client auth2 library loaded');
  	}

  	// check that sjpw site admin is logged in to Google: 
  	function initClient() {
        // Initialize the client with API key and People API, and initialize OAuth with an
        // OAuth 2.0 client ID and scopes (space delimited string) to request access.
    	gapi.client.init({
            apiKey: G_API_KEY,
            discoveryDocs: ['https://people.googleapis.com/$discovery/rest?version=v1'],
            clientId: G_CLIENT_ID,
            scope: G_SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        });
  	}

  	function updateSigninStatus(isSignedIn) {
        // When signin status changes, this function is called.
        // If the signin status is changed to signedIn, we make an API call.
        if (isSignedIn) {
          	makeApiCall();
			getCalendarInfo();     		
			// 
			signinButton.style.display = 'none';
            signoutButton.style.display = 'block';
        } else {
        	signinButton.style.display = 'block';
            signoutButton.style.display = 'none';
        }
  	}

  	function handleSignInClick(event) {
        // Ideally the button should only show up after gapi.client.init finishes, so that this
        // handler won't be called before OAuth is initialized.
        gapi.auth2.getAuthInstance().signIn();
  	}

  	function handleSignOutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
  	}

	//----------------- API CALLS ---------------------//
	//people api
  	function makeApiCall() {
        // Make an API call to the People API, and print the user's given name.
        gapi.client.people.people.get({
          	resourceName: 'people/me'
        }).then(function(response) {
          	console.log('Hello, SJPW webmaster: ' + response.result.names[0].givenName, response);
        }, function(reason) {
          	console.log('Error: ' + reason.result.error.message);
        });
  	}

  	//calendar api
  	function getCalendarInfo() {
		//get the calendar ID where I want to insert events
  		$.ajax({
			type: 'GET',
			url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
			dataType: 'jsonp'
  		}).done(function(response){
			console.log(response);

		}).fail(function(response){
				console.log('error: ', response);
		});

  // 		// gapi.client.calendarList.get({
  // 		// 	resourceName: 'items/test'
  // 		// }).then(function(response) {
  // 		// 	console.log(response.result.calendarId);
  // 		// }, function(reason) {
  // 		// 	console.log('Error: ' + reason.result.error.message);
        
  // 		// });
  	}

	//----------------------- DO THIS STUFF -------------------//

	listen();
	findEvents();
	handleClientLoad();

	$('#authorize-button').on('click', function(e) {
        e.preventDefault();
        handleSignInClick();
        console.log('clicked the Log In button');
    });

});// END of doc.ready()