var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var appRouter = function(app) {
	var googleKey = "AIzaSyBE3Ws6nnhg6HOJMfNfZ-bjKENoFKiug48";
	var apiUrl = "https://maps.googleapis.com/maps/api/directions/json?";

	app.get("/", function(request, response) {
		response.send("Hello world!");
	})

	app.get("/dir", function(request, response) {
		if (!request.query.origin || !request.query.destination) {
			response.send({"error": "Missing parameter"});
			return null;
		}

		var createCORSRequest = function(method, url) {
		    var xhr = new XMLHttpRequest();
		    xhr.responseType = 'json';
			if ("withCredentials" in xhr) {
				// XHR for Chrome/Firefox/Opera/Safari.
				xhr.open(method, url, true);
			} else if (typeof XDomainRequest != "undefined") {
				// XDomainRequest for IE.
				xhr = new XDomainRequest();
				xhr.open(method, url);
			} else {
				// CORS not supported.
				xhr = null;
			}
			return xhr;
		};
		var xhr = createCORSRequest('GET', apiUrl +
			'origin=' + request.query.origin +
			'&destination=' + request.query.destination +
			'&key=' + googleKey);

		xhr.onload = function() {
			var raw = JSON.parse(xhr.responseText);
			var steps = raw.routes[0].legs[0].steps
			var filtered = {steps: [], polyline: raw.routes[0].overview_polyline.points};
			filtered.steps = steps.map(function(step) {
				var newStep = {};
				newStep['distance'] = step.distance.value;
				newStep['duration'] = step.duration.value;
				newStep['end_location'] = step.end_location;
				newStep['html_instructions'] = step.html_instructions;
				newStep['maneuver'] = step.maneuver;
				return newStep;
			});
			response.send(filtered);
		}
		xhr.send();
	})
}

module.exports = appRouter;