
$(document).ready(function() {

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

	var findEvents = function(){
		console.log('checking for next events');

		var meetUpKey = '112f1c6d117217b646034221513f16';
		var meetUpName = ['cherryhill-taichi-group', 'Girl-Develop-It-Camden'];

		for (var i = meetUpName.length - 1; i >= 0; i--) {

			$.ajax({
				type: 'GET',
				url: 'https://api.meetup.com/' + meetUpName[i] + '/events?&sign=true&photo-host=public&page=1&fields=short_link&status=upcoming&_app_key=' + meetUpKey, 
				dataType: 'jsonp'

			}).done(function(response){

				for (var i = response.data.length - 1; i >= 0; i--) {
					var eventDateTime = response.data[i].time;
					var eventLink = response.data[i].short_link;
					var eventName = response.data[i].name;	
				}
				
		 		var nextEvents = [eventName, eventLink, convertDateTime(eventDateTime)];
 				console.log(nextEvents, nextEvents[0]);
 				// return(nextEvents);
						
			}).fail(function(response){
				console.log('error: ', response);
			});
		}
	}

	// source: https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
	var convertDateTime = function(eventDateTime){
		var a = new Date(eventDateTime * 1000);
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var year = a.getFullYear();
		var month = months[a.getMonth()];
		var date = a.getDate();
		var hour = a.getHours();
		var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes(); 
		// var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
		var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ' o\'clock.' ;
		return time;

		console.log(time);
	}

	// var addEventToCalendar = function(nextEvents) {
	// 	// takes the date, time description and link to event's page on Meetup and creates a G-calendar event on my test G-calendar. 
	// }

	var createEvent = function(eventDateTime, eventLink, eventName){
		
		var event = {
			'summary': ' Google I/O 2015',
			// 'location': '800 Howard St., San Francisco, CA 94103',
			'description': 'A chance to hear more about Google\'s developer products.',
			'start': {
			'dateTime': '2015-05-28T09:00:00-07:00',
			'timeZone': 'America/Los_Angeles'
			},
			'end': {
			'dateTime': '2015-05-28T17:00:00-07:00',
			'timeZone': 'America/Los_Angeles'
			}
		};
		var request = gapi.client.calendar.events.insert({
			'calendarId': 'primary',
			'resource': event
		});

		request.execute(function(event) {
  			appendPre('Event created: ' + event.htmlLink);
		});



		$.ajax({
			type: 'POST',
			url: 'https://www.googleapis.com/calendar/v3/calendars/' + testCalendarId + '/events',
			dataType: 'jsonp'

		}).done(function(response){
			console.log(response);

		}).fail(function(response){
				console.log('error: ', response);
			});
	}

	//---------	TALK TO GOOGLE CALENDAR API----------------//

	var gclientId = '419714143213-m78j61414b5h7u0uo91n40gidl5a0kce.apps.googleusercontent.com';
	var gapiKey = 'AIzaSyA9QOKvd0OrCQwFDtkWD5TCYBj4nxm8ioI';
	var gscopes = 'https://www.googleapis.com/auth/calendar';
	var testCalendarId = 'amyeckertprojects.com_lrij2jrn2cub096ebeh6e16r94@group.calendar.google.com';




//------------- LOAD RESOURCES / 0AUTH --------------//

	function handleClientLoad() {
        // Loads the client library and the auth2 library together for efficiency.
        // Loading the auth2 library is optional here since `gapi.client.init` function will load
        // it if not already loaded. Loading it upfront can save one network request.
        gapi.load('client:auth2', initClient);
        console.log('client auth2 library loaded');
  	}

  	function initClient() {
        // Initialize the client with API key and People API, and initialize OAuth with an
        // OAuth 2.0 client ID and scopes (space delimited string) to request access.
    	gapi.client.init({
            apiKey: 'AIzaSyA9QOKvd0OrCQwFDtkWD5TCYBj4nxm8ioI',
            discoveryDocs: ["https://people.googleapis.com/$discovery/rest?version=v1"],
            clientId: '419714143213-dg82c6s6si9dgoe90po1tgdhpnj39hik.apps.googleusercontent.com',
            scope: 'profile'
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
      		console.log('you are signed in');
          	makePeopleApiCall();
          	makeCalendarApiCall();
        }
  	}

  	function handleSignInClick(event) {
        // Ideally the button should only show up after gapi.client.init finishes, so that this
        // handler won't be called before OAuth is initialized.
        gapi.auth2.getAuthInstance().signIn();
      	console.log('signed in successfully');
  	}

  	function handleSignOutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
        console.log('signed out successfully');
  	}

	//----------------- API CALLS ---------------------//

  	function makePeopleApiCall() {
        // Make an API call to the People API, and print the user's given name.
        gapi.client.people.people.get({
          	resourceName: 'people/me'
        }).then(function(response) {
          	console.log('Hello, SJPW webmaster: ' + response.result.names[0].givenName);
        }, function(reason) {
          	console.log('Error: ' + reason.result.error.message);
        });

        
  	}
  	function makeCalendarApiCall() {
  		//get the calendar ID
  		// gapi.client.calendarList.insert({
  		// 	resourceName: 'primary'
  		// }).then(function(response) {
  		// 	console.log(response.result.calendarId);
  		// }, function(reason) {
  		// 	console.log('Error: ' + reason.result.error.message);
        
  		// });
  	}

	//----------------------- DO THIS STUFF -------------------//

	listen();
	findEvents();
	handleClientLoad();
	

	// $('#authorize-button').on('click', function(e) {
 //        // e.preventDefault();
 //        handleSignInClick();
 //        console.log('clicked the Log In button');
 //    });

});// END of doc.ready()