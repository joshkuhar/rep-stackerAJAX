$(document).ready( function() {
	$('.inspiration-getter').submit( function(e){
		e.preventDefault();
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		//var tags = $(this).find("input[name='tags']").val();
		//getUnanswered(tags);

		var tagged = $(this).find("input[name='answerers']").val();
		console.log(tagged);


	});
});



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

var showAnswerer = function(question) {
	
	// clone our result template code
	var result = $('.templates .answerer').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.answerer-text a');
	questionElem.attr('href', user.link);
	questionElem.text(user.link);


	// set the date asked property in result
	//var asked = result.find('.asked-date');
	//var date = new Date(1000*question.creation_date);
	//asked.text(date.toString());

	// set the .viewed for question property in result
	//var viewed = result.find('.viewed');
	//viewed.text(question.view_count);

	// set some properties related to asker
	//var asker = result.find('.asker');
	//asker.html('<p>Name: <a target="_blank" '+
		//'href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
		//question.owner.display_name +
		//'</a></p>' +
		//'<p>Reputation: ' + question.owner.reputation + '</p>'
	//);

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
		console.log(searchResults);

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

var getAnswerer = function(tags) {
	var request = {
		tagged: tags,
		site: "stackoverflow"
		//period: "all_time"
	};

	$.ajax({
		//url: "https://api.stackexchange.com/2.2//2.2/tags/{tag}/top-answerers/all_time/",
		url: "https://api.stackexchange.com/2.2//2.2/tags/top-answerers/all_time/",
		data: request,
		dataType: "jsonp",
		type: "GET",
	})
		.done(function(result){ //this waits for the ajax to return with a succesful promise object
		var searchResults = showSearchResults(request.tagged, result.items.length);
		console.log(searchResults);

		$('.search-results').html(searchResults);
		//$.each is a higher order function. It takes an array and a function as an argument.
		//The function is executed once for each item in the array.
		$.each(result.items, function(i, item) {
			var question = showAnswerer(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});



};



/*
	1. User inputs a value (some search term)
	2. We pass that term to ajax and we send a request with that term attached
	3. Now I need to append this data 
	4. I need to handle my errors in case there is no data
*/
/*
$('button').click(function(){
	search($('input').val());
});


function search(searchTerm) {
	var request = { 
		tagged: searchTerm,
		site: 'stackoverflow',
		order: 'desc',
		sort: 'creation'
	};
	
	$.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",//use jsonp to avoid cross origin issues
		type: "GET",
	}).done(function(results) {
		console.log(results.items);
		// now you have an array of objects (search result items) and you can present them to the user the way you want. You will simply user dot notation to access object properties e.g. append title, author etc
		
		
		// if our server returns some data (if it finds some) we will get it here
		
	}).fail(function(error){
		
		// if an error occurs, we will handle it here
		
	});
}

Script below works.

<!DOCTYPE html>
<html>
<head>
<script src="https://code.jquery.com/jquery-2.2.4.js"></script>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>JS Bin</title>
</head>
<body>
  <form class="getter">
  <input type="text" placeholder='e.g., "HTML" or "HTML;CSS"' name="tag" size="30" autofocus required>
  <input type="submit" value="Submit">
  </form>
  <div></div>
 
</body>
</html>
$(document).ready(function(){
    $('.getter').submit( function(e){
		e.preventDefault();
		var tag = $(this).find("input[name='tag']").val();
        console.log(tag);
        var answerer = getAnswerer(tag);
	});
  });
var getAnswerer = function(tag) {
  var request = {
    tagged: tag,
    site: 'stackoverflow'
  };
  
  var x = request.tagged;
  $.ajax({
    url: "http://api.stackexchange.com/2.2/tags/" + x + "/top-answerers/all_time?",
    data: request,
    dataType: "jsonp",
    type: "GET"
  })
  .done(function(results){
    console.log(results.items[0].user);
  })
  .fail(function(error){
    console.log("error");
  });
};



*/




