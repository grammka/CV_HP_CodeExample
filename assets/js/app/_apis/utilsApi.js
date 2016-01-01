angular.module('HPApp').factory('utilsAPI', function(apiRequest) {
	var API = {};


	API.getOpenGraph = function(links) {
		return apiRequest('utils/opengraph', 'POST', {urls: links});
	};

	API.sendTimezone = function() {
		return apiRequest('utils/timezone', 'POST', {offset: (new Date()).getTimezoneOffset()});
	};


	return API;
});
