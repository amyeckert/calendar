
// var CAL = CAL || {}; //checks to see if this object already exists first, if not, create new object. If var CAL = 'foo'; existed, it would be overriden !
$(document).ready(function() {


	var listen= function(){
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
		var meetUpName = ['cherryhill-taichi-group', 'cherryhill-taichi-group'];

		for (var i = meetUpName.length - 1; i >= 0; i--) {

		 	var upcomingEvents = $.ajax({
				type: 'GET',
				url: 'https://api.meetup.com/' + meetUpName[i] + '/events?&sign=true&photo-host=public&page=20&fields=short_link&status=upcoming&_app_key=' + meetUpKey, 
				dataType: 'jsonp'

			}).done(function(response){
					// for (var i = upcomingEvents.length - 1; i >= 0; i--) {
						console.log(upcomingEvents);
					// }


				// for (var i = response.data.length - 1; i >= 0; i--) {
				// 	var eventDateTime = response.data[i].time;
				// 	var eventLink = response.data[i].short_link;
				// 	var eventName = response.data[i].name;	
				// }
				
		 		// var nextEvents = [eventName, eventLink, eventDateTime];
		 		// console.log(nextEvents);
			
			}).fail(function(response){
				console.log('error: ', response);
			});
		}

		// Tai Chi Cherry Hill
		// var taiChi = 'cherryhill-taichi-group';

			// console.log(nextTaiChiEvent);		



		//GDI-Camden
		// var gdiCamden = 'Girl-Develop-It-Camden';
		// $.ajax({
		// 	type: 'GET',
		// 	url: 'https://api.meetup.com/' + gdiCamden + '/events?&sign=true&photo-host=public&page=4&fields=short_link&status=upcoming&_app_key=' + meetUpKey, 
		// 	dataType: 'jsonp'

		// }).done(function(response){

		// 	for (var i = response.data.length - 1; i >= 0; i--) {
			
		// 		var eventDateTime = response.data[0].time;
		// 		var eventLink = response.data[0].short_link;
		// 		var eventName = response.data[0].name;
		// 	}
		// 	var nextGdiEvent = [eventName, eventLink, eventDateTime];
		// 		console.log(nextGdiEvent);			

		// }).fail(function(response){
		// 	console.log('error: ', response);
		// });
	}

	var convertDateTime = function(eventDateTime){
		var eventDateTime = new Date(year, month, day, hours);
		eventDateTime.toDateSTring();
		console.log(eventDateTime);
	}

	var addToCalendar = function(){
		// takes the date, time description and link to event's page on Meetup and creates a G-calendar event on my test G-calendar. 
	}

	listen();
	findEvents();

});// END of doc.ready()