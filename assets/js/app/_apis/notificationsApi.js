angular.module('HPApp').factory('notificationsAPI', function(sharedData, apiRequest) {

	var API = {};


	// Snaps List ====================================================================== /

	API.set = function(data) {
		return apiRequest('users/me/notification_settings', 'PATCH', data);
	};


	return API;

});
