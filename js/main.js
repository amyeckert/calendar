
$(document).ready(function() {
	handleClientLoad();
	// updateSigninStatus();

	$('#signin').hide();
	$('#signout').hide();

	//---------	GOOGLE CALENDAR API----------------//
	const G_CLIENT_ID = '419714143213-dg82c6s6si9dgoe90po1tgdhpnj39hik.apps.googleusercontent.com';
	const G_API_KEY = 'AIzaSyA9QOKvd0OrCQwFDtkWD5TCYBj4nxm8ioI';
	const G_SCOPES_PEOPLE = 'https://www.googleapis.com/auth/userinfo.profile';
	const G_SCOPES_CAL = 'https://www.googleapis.com/auth/calendar';
	const TEST_CAL_ID = 'amyeckertprojects.com_lrij2jrn2cub096ebeh6e16r94@group.calendar.google.com';
	const DISCOVERY_DOCS_CAL = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
	const DISCOVERY_DOCS_PEOPLE = ['https://people.googleapis.com/$discovery/rest?version=v1'];
	

	//---------	MEET UP API-----------------------//
	const MEET_UP_KEY = '112f1c6d117217b646034221513f16';
	const MEET_UP_NAME = ['cherryhill-taichi-group', 'Girl-Develop-It-Camden'];

	//----------- GLOBAL VARIABLES ----------------//
	var signinButton = document.getElementById('signin');
  	var signoutButton = document.getElementById('signout');

	// go to external calendars and get events to add to test calendar (sjpw's calendar eventually) 
	var findEvents = function(){
		console.log('checking for upcoming events for Cherry Hill Tai Chi and GDI-Camden');

		for (var i = MEET_UP_NAME.length - 1; i >= 0; i--) {
			$.ajax({
				type: 'GET',
				url: 'https://api.meetup.com/' + MEET_UP_NAME[i] + '/events?&sign=true&photo-host=public&page=1&fields=short_link&status=upcoming&_app_key=' + MEET_UP_KEY, 
				dataType: 'jsonp'

			}).done(function(response){
				// iterate over response to get the following data, 
				for (var i = response.data.length - 1; i >= 0; i--) {
					var eventStartTime = convertTimestamp(response.data[i].time);
					var eventLink = response.data[i].short_link;
					var eventName = response.data[i].name;	

 					// format the data for GCal events
 					var eventToAdd = {
						'summary':  eventName,
						'start': {'dateTime': eventStartTime,
									'timeZone': 'America/New_York'},
						'source': {
							'url': eventLink
						}
					};
					appendPre('ADD THIS EVENT: ' + eventToAdd.summary + ', ' + eventToAdd.start.dateTime + ', ' + eventToAdd.source.url +'\n');

					// insertEvent(eventToAdd);
				}

			}).fail(function(response){
				console.log('error: ', response);
			});
		}
		console.log('found events');
	}
    // https://developers.google.com/google-apps/calendar/v3/reference/events/insert#examples
	// var insertEvent = function(eventToAdd){

	// 	//need if statement to see if event already exists on calendar to prevent adding it repeatedly on page load.

	//     var event = eventToAdd;

	//     $.ajax({
	//     	type: 'POST',
	// 		url: 'https://www.googleapis.com/calendar/v3/calendars/' + TEST_CAL_ID + '/events',
	// 		resource: event

	//     }).done(function(response){
	//     	console.log(event);
	    	
	//     }).fail(function(response){
	// 			console.log('error: ', response);

	// 	});
	// }

	    // var request = gapi.client.calendar.events.insert({
	    //   	'calendarId': TEST_CAL_ID,
	    //   	'resource': event,

	    // });

	    // request.execute(function(event){
	    // 	apprendPre('Event added to TEST Calendar: ' + event.htmlLink);
	    // 	// console.log('Event created: ' + event.htmlLink);
	    // });

	// source https://gist.github.com/kmaida/6045266
	function convertTimestamp(timestamp) {
	  	var d = new Date(timestamp),	// Convert the passed timestamp to milliseconds or--.toISOString(); ?
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


	//------------- LOAD RESOURCES & 0AUTH --------------//
	//source https://developers.google.com/google-apps/calendar/quickstart/js#step_2_set_up_the_sample
        // Loads the client library and the auth2 library together for efficiency.
        // Loading the auth2 library is optional here since `gapi.client.init` function will load
        // it if not already loaded. Loading it upfront can save one network request.
	function handleClientLoad() {  
       gapi.load('client:auth2', initClientCalendar);
       gapi.load('client:auth2', initClientPeople);
       console.log('people and calendar clients loaded');
  	}

  	// check that sjpw site admin is logged in to Google: 
  	function initClientCalendar() {
        // Initialize the client with API key and People API, and initialize OAuth with an
        // OAuth 2.0 client ID and scopes (space delimited string) to request access.
    	gapi.client.init({
            apiKey: G_API_KEY,
            discoveryDocs: DISCOVERY_DOCS_CAL,
            clientId: G_CLIENT_ID,
            scope: G_SCOPES_CAL
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        });
    }

    function initClientPeople() {
        gapi.client.init({
        	apiKey: G_API_KEY,
        	discoveryDocs: DISCOVERY_DOCS_PEOPLE,
        	clientId: G_CLIENT_ID,
        	scope: G_SCOPES_PEOPLE
        }).then(function(){
        	 // Listen for sign-in state changes.
        	gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        	 // Handle the initial sign-in state.
        	updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        });
  	}

  	function updateSigninStatus(isSignedIn) {
        // When signin status changes, this function is called.
        if (isSignedIn) {
			listUpcomingEvents();  
			console.log('you are logged in'); 
			$('#signin').hide();
			$('#signout').show();

        } else {
        	console.log('please log in to continue');
        	$('#signin').show();
			$('#signout').hide();
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
  	 // Append a pre element to the body containing the given message
    //  as its text node. Used to display the results of the API call. 
    //  @param {string} message Text to be placed in pre element.
   
  	function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
  	}
	
	//----------------- API CALLS ---------------------//
	// call people api
  	// function getUserName() {
   //      // Make an API call to the People API, and print the user's given name.
   //      gapi.client.people.people.get({
   //        	resourceName: 'people/me'
   //      }).then(function(response) {
   //        	console.log('Hello, ' + response.result.names[0].givenName);
   //      }, function(reason) {
   //        	console.log('Error: ' + reason.result.error.message);
   //      });
  	// }

  	//call calendar api
  	function listUpcomingEvents() {
        gapi.client.calendar.events.list({
          'calendarId': TEST_CAL_ID,
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(function(response) {
        	console.log(response.result);
        	console.log(response.result.etag);

          var events = response.result.items;
          appendPre('pre-exisiting events on TEST cal: ');

          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var event = events[i];
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
              appendPre(event.summary + ' (' + when + ')')
            }
          } else {
            appendPre('No upcoming events found.');
          }
        });
  	}


  	//--------	SCROLL TO TOP -----------------------//
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
	//----------------------- DO THIS STUFF -------------------//

	listen();
	findEvents();
	// getUserName();
	
	
	$('#signin').on('click', function(e) {
        e.preventDefault();
        handleSignInClick();
        console.log('clicked the Log In button');
    });

    $('#signout').on('click', function(e){
    	e.preventDefault();
    	handleSignOutClick();
    	console.log('you have signed out');
    })

});// END of doc.ready()