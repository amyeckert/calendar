//namespacing! store all functions, objects, etc inside one BIG object, so no conflicts with other libraries or code.
// One Page Website OPW, can be ALLCAPS for a Global object. Easier to read

// 1. OPW is acronym for One Page Website. This is typical naming convention

var OPW = OPW || {}; //checks to see if this object already exists first, if not, create new object. If var OPW = 'foo'; existed, it would be overriden !

OPW.utilities = {
	listen: function(){

		//	attach click event to hamburger icon
		$('.nav-main').on('click', function(){
			$('.nav-main').slideToggle(400, function(){
				// alert('done!');
			});
		});

		//	a js breakpoint
		// $(window).on('resize', function(){
		// 	// get width of window
		// 	var w = $(window).width();
		// 	console.log('resizing window now ' + w);

		// 	// if width > 420, do stuff
		// 	if(w > 480 && $('.nav-main').is(':hidden')) {
		// 		// $('.nav-main').removeAttr('style');
		// 		$('nav-main').addClass('is-mobile');

		// 	} else if ( w < 480 && $('.nav-main').is(':visible')) {
		// 		// console.log('menu is still open');
		// 		$('.nav-main').removeAttr('style');
		// 	}
		// });

		// scrollTo functionality
		$('.nav-main a').on('click', function(event) {
			event.preventDefault();

			var pageToScrollTo = $(this).attr('href');
			console.log(pageToScrollTo);

			//set the speed of scroll, destination, call the function on the window
			$(window).scrollTo(pageToScrollTo, 300);

			//highlight current page in nav-main
			var backToTop = $(this).addClass('is-current');



		});


		//	form controls
		var form = document.getElementById('log-in');

		form.addEventListener('submit', function(event){
			alert("button is clicked");
			event.preventDefault(); //prevent form from submitting
			var heading = document.getElementById('heading');

			var items = document.getElementsByClassName('form-item')[1];

			var notice = document.getElementsByClassName('sign-up');

			heading.innerText = 'Thank you for submitting!';

			items.innerHTML += '<p>added this</p>';
			// items[1].innerText = 'Added this on-submit!';
			// notice.innerHTML = '<div> updated the inner html! </div>';

			console.log(items);

		}); 

	},
} //End OPW

$(document).ready(function() {
	OPW.utilities.listen();

});// END of doc.ready()