let service;
let food;
let town;
let value;
let result = 0;
let imgResult = 0;
let photos;
let hours;
let phone;
let website;
let review;
let reviewNum = 0;

//clickhandler to begin search.
function lightboxOpen() {
	$('.beginButton').on('click', function() {
		$('.beginButton').css('visibility', 'hidden');
		$('.lightbox').fadeIn(200).css('display', 'block');
	});
}
//loads results page
function search() {
	$('.firstPage').fadeOut(300);
	$('.lightbox').fadeOut(300);
	$('.resultsPage').css('display', 'grid');
}
//check to see if user enters required data into input fields. If not, error screen loads.
function nothingFound() {
	$('.searchButton').on('click', function(event) {
		event.preventDefault();
		food = $('.dropdown').val();
		town = $('.location').val();
		value = 'brewery ' + town + " " + food;
		if (!food || !town) {
			$('.lightbox').fadeOut(200);
			$('.makeASelectionScreen').css('display', 'block').delay(3000).fadeOut(200);
			setTimeout(function() {
				$('.lightbox').fadeIn(200).css('display', 'block');
			}, 3000)
		} else {
			initialize(value);
		}
	});
}
//calls google places api passing in user input. If no results found, error message loads. 
function initialize(searchterm) {
	service = new google.maps.places.PlacesService($('.location, .food').get(0));
	service.textSearch({
		query: searchterm,
		type: 'bar'
	}, function(place) {
		checkBeginningReset(place);
		if (place[0] == undefined) {
			$('.lightbox').fadeOut(200);
			$('.makeASelectionScreen').fadeIn(200).css('display', 'block').delay(3000).fadeOut(100);
			setTimeout(function() {
				$('.lightbox').fadeIn(200).css('display', 'block');
			}, 3000)
		} else {
			$('.firstPage').fadeOut(200);
			$('.lightbox').fadeOut(200);
			getDetails(place[result]);
			search();
		}
	});
}
//pushes api data into global variables and runs results functions. 
function getDetails(place) {
	service.getDetails({
		placeId: place.place_id
	}, function callback(placeId) {
		photos = placeId.photos;
		hours = placeId.opening_hours;
		phone = placeId.formatted_phone_number;
		review = placeId.reviews;
		website = placeId.website;
		displayImages();
		displayHours();
		displayWebsite();
		displayPhone();
		reviews();
	});
	displayResults(place)
}
//loops results array.
function checkBeginningReset(place) {
	if (place[result] == undefined) {
		result = 0;
	}
}
//displays images on results page.
function displayImages() {
	clearResults();
	if(photos == undefined){
		$('.resultsImg').append(`No Images Available`);
	}else{$('.resultsImg').append(`<img alt="google image of location" class="locationImg" src="${photos[imgResult].getUrl({maxWidth: 400, maxHeight: 400})}">`);
	}
}
//displays location name and address on results page.
function displayResults(place) {
	$('.results').html(`<h1 class="name">${place.name}</h1>
	<address><a href="https://www.google.com/maps?q=${place.formatted_address}" 
	target="_blank" class="address">${place.formatted_address}</a></address>`);
	result++;
}
//displays wesbite on results page. 
function displayWebsite() {
	$('.results').append(`<a target="_blank" href="${website}"class="website">${website}</a>`);
}
//displays phone number on results page. 
function displayPhone() {
	if(phone == undefined){
		$('.results').append(` `);
	}else{
	$('.results').append(`<p class="phone">${phone}</p>`);
	}
}	
//displays hours on results page. 
function displayHours() {
	$('.hours').empty();
	for (let i = 0; i < hours.weekday_text.length; i++) {
		$('.hours').append(`<ul><li> ${hours.weekday_text[i]}</li></ul>`).addClass('animated fadeInLeft').css('animation-duration', '3s');
	}
}
//displays reviews on results page. 
function reviews() {
	if(review == undefined){
		$('.reviewSection').html(`No Reviews Available`);
	}else{ 
		$('.reviewSection').html(`<h2 class="rating"><span>Review:</span> ${review[reviewNum].rating} 
			out of 5</h2><p class="review">${review[reviewNum].text}</p>`).addClass('animated fadeInRight').css('animation-duration', '3s');
	}	
	$('.leftRev').fadeIn(6000);
	$('.rightRev').fadeIn(6000);
}
//loops through reviews. 
function nextReview() {
	$('.rightRev').on('click', function(event) {
		event.preventDefault();
		reviewNum = reviewNum + 1;
		if (review[reviewNum] == undefined) {
			reviewNum = 0;
		}
		reviews();
	});
}

function prevReview() {
	$('.leftRev').on('click', function(event) {
		event.preventDefault();
		reviewNum = reviewNum - 1;
		if (review[reviewNum] == undefined) {
			reviewNum = 4;
		}
		reviews();
	});
}
//loads next location result. 
function nextOption() {
	$('.nextOption').on('click', function(event) {
		event.preventDefault();
		initialize(value);
		$('.loadScreen').css('display','none');
		imgResult = 0;
		reviewNum = 0;
	});
}
//loops through images. 
function nextImg() {
	$('.rightImg').on('click', function() {
		imgResult = imgResult + 1;
		if (photos[imgResult] == undefined) {
			imgResult = 0;
		}
		displayImages();
	});
}

function prevImg() {
	$('.leftImg').on('click', function() {
		imgResult = imgResult - 1;
		if (photos[imgResult] == undefined) {
			imgResult = 9;
		}
		displayImages();
	});
}
//clears out image so next image can load when necessary.
function clearResults() {
	$('.resultsImg').empty();
}
//returns user to search input screen. 
function newSearch() {
	$('.newSearch').on('click', function() {
		$('.location').val('');
		$('.resultsPage').css('display', 'none');
		$('.firstPage').fadeIn(300).css('display', 'block');
		$('.lightbox').fadeIn(300).css('display', 'block');
	});
}
//loads clickhandlers when browser is ready. 
$(function() {
	nextOption();
	nextImg();
	prevImg();
	lightboxOpen();
	nothingFound();
	nextReview();
	prevReview();
	newSearch();
});