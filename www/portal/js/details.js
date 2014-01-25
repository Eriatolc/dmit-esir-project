/** Initialisation of the data.
 * We get the data from the server and they will be used by Mustache
 * to fill the HTML page.
 * 
 * @return: none.
 */
function init() {

	// Get the id at the end of the URL of the page
	var url = document.URL;
	var res = url.split("#");
	var id = res[1];

	// Get the Alert with an XHR
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/api/alert/' + id, false);
	xhr.send();

	// Parsing the response
	var response = JSON.parse(xhr.responseText);
	var data = response;

	// Date modification
	var date = new Date(data.date);
	data.date = date.toDateString();
	data.time = date.toTimeString();

	// Data modification
	data.data = JSON.stringify(data.data);

	// Generating the template using Mustache
	var template = document.getElementById('details').innerHTML;
	var html = Mustache.render(template, data);
	document.getElementById('list').innerHTML += html;
}

// We use the init function only when the DOM is loaded
document.addEventListener('DOMContentLoaded', init, false);