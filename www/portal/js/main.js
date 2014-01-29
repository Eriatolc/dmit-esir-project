<<<<<<< HEAD
/** Initialisation of the data.
 * We get the data from the server and they will be used by Mustache
 * to fill the HTML page.
 * 
 * @return: none.
 */
function init() {

	// Set the listeners on the webpage
	setListeners();

	// Get the Alert with an XHR
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/api/search/alert', false);
	xhr.send();

	// Parsing the response
	var response = JSON.parse(xhr.responseText);

	var data = prepareData(response);

	// Generating the template using Mustache
	var template = document.getElementById('tab').innerHTML;
	var html = Mustache.render(template, data);
	document.getElementById('alertTab').innerHTML += html;
}

function prepareData(response) {
	var data = response;
	var item;
	var date;
	for(var i = 0; i<data.items.length; i++) {
		date = new Date(data.items[i].date);
		data.items[i].date = date.toDateString();
		data.items[i].time = date.toTimeString();
		data.items[i].data = JSON.stringify(data.items[i].data);
	}

	return data;
}

function setListeners() {
	var list = document.getElementById('graph');
	list.addEventListener('change', function() {
		// We get the content when the selectedIndex change and we display it
		// in the webpage correctly (above the graph)
		var value = list.options[list.selectedIndex].innerHTML;
		document.getElementById('graphTitle').innerHTML = value;
	}, true);
}

// We use the init function only when the DOM is loaded
document.addEventListener('DOMContentLoaded', init, false);
=======
var data = {
	labels : ["January","February","March","April","May","June","July"],
	datasets : [
		{
			fillColor : "rgba(220,220,220,0.5)",
			strokeColor : "rgba(220,220,220,1)",
			pointColor : "rgba(220,220,220,1)",
			pointStrokeColor : "#fff",
			data : [65,59,90,81,56,55,40]
		},
		{
			fillColor : "rgba(151,187,205,0.5)",
			strokeColor : "rgba(151,187,205,1)",
			pointColor : "rgba(151,187,205,1)",
			pointStrokeColor : "#fff",
			data : [28,48,40,19,96,27,100]
		}
	]
}


//Get the context of the canvas element we want to select
var ctx = document.getElementById("myChart").getContext("2d");
var Bar = new Chart(ctx).PolarArea(data);

//creation
new Chart(ctx).Bar(data);

Bar.defaults = {
				
	//Boolean - If we show the scale above the chart data			
	scaleOverlay : false,
	
	//Boolean - If we want to override with a hard coded scale
	scaleOverride : false,
	
	//** Required if scaleOverride is true **
	//Number - The number of steps in a hard coded scale
	scaleSteps : null,
	//Number - The value jump in the hard coded scale
	scaleStepWidth : null,
	//Number - The scale starting value
	scaleStartValue : null,

	//String - Colour of the scale line	
	scaleLineColor : "rgba(0,0,0,.1)",
	
	//Number - Pixel width of the scale line	
	scaleLineWidth : 1,

	//Boolean - Whether to show labels on the scale	
	scaleShowLabels : true,
	
	//Interpolated JS string - can access value
	scaleLabel : "<%=value%>",
	
	//String - Scale label font declaration for the scale label
	scaleFontFamily : "'Arial'",
	
	//Number - Scale label font size in pixels	
	scaleFontSize : 12,
	
	//String - Scale label font weight style	
	scaleFontStyle : "normal",
	
	//String - Scale label font colour	
	scaleFontColor : "#666",	
	
	///Boolean - Whether grid lines are shown across the chart
	scaleShowGridLines : true,
	
	//String - Colour of the grid lines
	scaleGridLineColor : "rgba(0,0,0,.05)",
	
	//Number - Width of the grid lines
	scaleGridLineWidth : 1,	

	//Boolean - If there is a stroke on each bar	
	barShowStroke : true,
	
	//Number - Pixel width of the bar stroke	
	barStrokeWidth : 2,
	
	//Number - Spacing between each of the X value sets
	barValueSpacing : 5,
	
	//Number - Spacing between data sets within X values
	barDatasetSpacing : 1,
	
	//Boolean - Whether to animate the chart
	animation : false,

	//Number - Number of animation steps
	animationSteps : 60,
	
	//String - Animation easing effect
	animationEasing : "easeOutQuart",

	//Function - Fires when the animation is complete
	onAnimationComplete : null
	
}
>>>>>>> Commit des choses faites la semaine dernière
