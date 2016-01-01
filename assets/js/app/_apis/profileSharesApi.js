angular.module('HPApp').factory('profileSharesAPI', function(apiRequest) {
	var API = {};


	API.get = function() {
		return apiRequest('users/me/shares');
	};

	API.share = function(userId) {
		return apiRequest('users/me/shares', 'POST', {to_profile: userId});
	};

	API.stopSharing = function(userId) {
		return apiRequest('users/me/shares/' + userId, 'DELETE');
	};


	return API;
});
