angular.module('HPApp').factory('profileIgnoreAPI', function(apiRequest) {
	var API = {};


	API.get = function() {
		return apiRequest('users/me/ignore');
	};

	API.ignore = function(userId) {
		return apiRequest('users/me/ignore', 'POST', {to_profile: userId});
	};
		
	API.stopIgnoring = function(userId) {
		return apiRequest('users/me/ignore/' + userId, 'DELETE');
	};


	return API;
});
