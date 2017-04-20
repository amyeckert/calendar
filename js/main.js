
//namespacing! store all functions, objects, etc inside one BIG object, so no conflicts with other libraries or code.
// can be ALLCAPS for a Global object. Easier to read
// 1. CAL is acronym for One Page Website. This is typiCAL naming convention

var CAL = CAL || {}; //checks to see if this object already exists first, if not, create new object. If var CAL = 'foo'; existed, it would be overriden !

CAL.utilities = {
	listen: function(){
		//	attach click event to hamburger icon
		// $('.nav-main').on('click', function(){
		// 	$('.nav-main').slideToggle(400, function(){
		// 		// alert('done!');
		// 	});
		// });
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
} 

$(document).ready(function() {

	CAL.utilities.listen();

	var userForm = document.getElementById('sign-up');
	var art = document.getElementById('add-image');
	const myId = 767; 
	var userId = 0;
	var listOfArt = document.getElementById('show-art');

	userForm.addEventListener('submit', function(event){
		//prevent form from submitting
		event.preventDefault();

		// get values of fields
		var firstName = $('#fname').val();
		var lastName = $('#lname').val();
		var email = $('#email').val();
		var password = $('#pword').val();
		// store 
		var newUser = [firstName, lastName, email, password];

		console.log('created new user!');
		
		createUser(firstName, lastName, email, password);
		console.table(newUser);
	
	});

	art.addEventListener('submit', function(event){
		event.preventDefault();
		
		// get url
		var url = $('#url').val();
		var title = $('#title').val();
		var $background = $('body');

		// console.log(url);

		$background.css('background-image', 'url("' + url  + '")');
		addPainting(myId, url, title);
		
	});
	// listArtworks
	listOfArt.addEventListener('submit', function(event){
		event.preventDefault();
		//get user by ID
		var userId = $('#user-id').val();
		console.log(userId);
		listPaintings(userId);

	});


// http://images.huffingtonpost.com/2012-08-18-GorillaSilverback6.jpg
// https://4.bp.blogspot.com/-LiAlf8oX1sU/UPQQyvOcP2I/AAAAAAAAEck/wmZk4jgN1VY/s1600/biscuit+doughnuts.jpg

});// END of doc.ready()