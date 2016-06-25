$(document).ready( function() {
	$('.unanswered-getter').submit( function(e){
		e.preventDefault();
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});


	$('.inspiration-getter').submit( function(e){
		e.preventDefault();
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tag = $(this).find("input[name='answerers']").val();
		//console.log(tag);
		getAnswerer(tag);
	});
});

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = { 
		tagged: tags,
		site: 'stackoverflow',
		order: 'desc',
		sort: 'creation'
	};
	
	$.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",//use jsonp to avoid cross origin issues
		type: "GET"
	})
	.done(function(result){ //this waits for the ajax to return with a succesful promise object
		var searchResults = showSearchResults(request.tagged, result.items.length);
		//console.log(searchResults);

		$('.search-results').html(searchResults);
		//$.each is a higher order function. It takes an array and a function as an argument.
		//The function is executed once for each item in the array.
		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

	var getAnswerer = function(tag) {
		var request = {
		tagged: tag,
		site: "stackoverflow"
		};

  		var x = request.tagged;
  		$.ajax({
    	url: "http://api.stackexchange.com/2.2/tags/" + x + "/top-answerers/all_time?",
    	data: request,
    	dataType: "jsonp",
    	type: "GET"
  		})

		.done(function(result){ //this waits for the ajax to return with a succesful promise object
		var searchResults = showSearchResults(request.tagged, result.items.length);
		//console.log(result);
		//console.log(searchResults);


		$('.search-results').html(searchResults);
		//$.each is a higher order function. It takes an array and a function as an argument.
		//The function is executed once for each item in the array.
		console.log(result);
		$.each(result.items, function(index, item) {
			//var question = showAnswerer(item);
			//$('.results').append(question);
			//console.log(item.user.display_name);
			var answerer = showAnswerer(item);
			$('.results').append(answerer);
			//console.log(item);
		});
	})
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});



};



// this function takes the question object returned by the StackOverflow request
// and returns new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);


	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the .viewed for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" '+
		'href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
		question.owner.display_name +
		'</a></p>' +
		'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};

var showAnswerer = function(answerer) {

	var result = $('.templates .answerer').clone();

	//inserts user name
	var answererName = result.find('.answerer-name');
	answererName.text(answerer.user.display_name);
	
	//inserts link to Answerers page
	var answererLink = result.find('.answerer-link a');
	answererLink.attr('href', answerer.user.link);
	answererLink.text(answerer.user.link);

	//inserts acceptance rate
	var acceptanceRate = result.find('.accept-rate');
	acceptanceRate.text(answerer.user.accept_rate);

	//inserts type of answerer
	var answererType = result.find('.user-type');
	answererType.text(answerer.user.user_type);
	
	//var answererElem = result.find(".answerer-name"); 
	//answererElem.text(question.user.display_name);
	console.log(answerer.user.display_name);
	//console.log(answerer.user.user_type);
	console.log(answerer.user.accept_rate);
	//console.log(answerer.user.link);
	return result;
};


// this function takes the results object from StackOverflow
// and returns the number of results and tags to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query + '</strong>';
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};



/*
	




*/




