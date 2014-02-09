/** Initialisation of the data.
 * We get the data from the server and they will be used by Mustache
 * to fill the HTML page.
 * 
 * @return: none.
 */
function init() {

	// Set the listeners on the webpage
	//setListeners();

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

/** Prepare the data before being displayed
 * @param {Object} response - XHR HTTP response
 * @return data - cleaned data
 */
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

// function setListeners() {
// 	var list = document.getElementById('graph');
// 	list.addEventListener('change', function() {
// 		// We get the content when the selectedIndex change and we display it
// 		// in the webpage correctly (above the graph)
// 		var value = list.options[list.selectedIndex].innerHTML;
// 		document.getElementById('graphTitle').innerHTML = value;
// 	}, true);
// }

// We use the init function only when the DOM is loaded
document.addEventListener('DOMContentLoaded', init, false);

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