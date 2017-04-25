
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
 				console.log(nextEvents);
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

	var addToCalendar = function(nextEvents){
		// takes the date, time description and link to event's page on Meetup and creates a G-calendar event on my test G-calendar. 
	}

	listen();
	findEvents();
	

});// END of doc.ready()