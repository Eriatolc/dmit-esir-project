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