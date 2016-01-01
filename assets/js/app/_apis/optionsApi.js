angular.module('HPApp').factory('optionsAPI', function(apiRequest) {

	var API = {};


	API.getCitiesLocations = function(query) {
		return apiRequest('options/locations', 'GET', {only_cities: true, search: query});
	};

	API.getCountriesLocations = function(query) {
		return apiRequest('options/locations', 'GET', {only_countries: true, search: query});
	};

	API.getAllLocations = function(query) {
		return apiRequest('options/locations', 'GET', {search: query});
	};

	/**
	 *
	 * @param lonlat "28.3207624,58.8558064"
	 * @returns {*}
	 */
	API.geoLocation = function(lonlat) {
		return apiRequest('options/cities', 'GET', {lonlat: lonlat});
	};

	API.getAffiliations = function(query) {
		return apiRequest('options/affiliations', 'GET', {search: query});
	};


	return API;

});
