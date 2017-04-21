
var CAL = CAL || {}; //checks to see if this object already exists first, if not, create new object. If var CAL = 'foo'; existed, it would be overriden !

CAL.utilities = {
	listen: function(){
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
	},

	findEvents: function(){
		console.log('checking for new events');
		var meetUpKey = '112f1c6d117217b646034221513f16';

		// Tai Chi Cherry Hill
		var taiChi = 'cherryhill-taichi-group';
	 	$.ajax({
			type: 'GET',
			url: 'https://api.meetup.com/' + taiChi + '/events?&sign=true&photo-host=public&page=20&fields=short_link,series&_app_key=' + meetUpKey, 
			dataType: 'jsonp'

		}).done(function(response){

			for (var i = response.data.length - 1; i >= 0; i--) {
			
				var eventDateTime = response.data[i].time;
				var eventLink = response.data[i].short_link;
				var eventName = response.data[i].name;
				
				console.log(eventName, eventLink, eventDateTime);

				console.log(response.data[0].description);
			}
		 

		}).fail(function(response){
			console.log('error: ', response);
		});


		//GDI-Camden
		// var gdiCamden = 'Girl-Develop-It-Camden';
		// $.ajax({
		// 	type: 'GET',
		// 	url: 'https://api.meetup.com/' + gdiCamden + '/events?&sign=true&photo-host=public&page=20&_app_key=' + meetUpKey, 
		// 	dataType: 'jsonp'

		// }).done(function(response){
		// 	console.log(response.data);

		// }).fail(function(response){
		// 	console.log('error: ', response);
		// });
	},

	timeConverter: function(UNIX_timestamp){
		  var a = new Date(UNIX_timestamp * 1000);
		  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		  var year = a.getFullYear();
		  var month = months[a.getMonth()];
		  var date = a.getDate();
		  var hour = a.getHours();
		  var min = a.getMinutes();
		  var sec = a.getSeconds();
		  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
		  return time;
	},
	addToCalendar: function(){
		// takes the date, time description and link to event's page on Meetup and creates a G-calendar event on my test G-calendar. 
	}

} // end CAL object


$(document).ready(function() {
	// console.log(CAL.utilities);

	CAL.utilities.listen();
	CAL.utilities.findEvents();
	// CAL.utilities.timeConverter(eventDateTime);
	// console.log(eventDateTime)

});// END of doc.ready()