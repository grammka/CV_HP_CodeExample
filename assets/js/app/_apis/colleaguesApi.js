angular.module('HPApp').factory('colleaguesAPI', function(
	$stateParams, $filter,
	sharedData, apiRequest, principal
) {
	var API = {};


	API.getByUserId = function(userId) {
		userId = userId || $stateParams.userId || sharedData.get('user.sv.id');

		return apiRequest('users/' + userId + '/colleagues');
	};

	API.getFacebookFriends = function() {
		return apiRequest('users/colleague_suggestion');
	};

	API.getPendingRequests = function() {
		return apiRequest('users/me/colleagues/requests/in');
	};

	API.getSentRequests = function() {
		return apiRequest('users/me/colleagues/requests/out');
	};

	API.sendRequest = function(userId) {
		return apiRequest('users/me/colleagues/requests/out', 'POST', {id: userId});
	};

	API.cancelRequest = function(userId) {
		return apiRequest('users/me/colleagues/requests/out/' + userId, 'DELETE');
	};

	API.acceptRequest = function(userId) {
		return apiRequest('users/me/colleagues/requests/in', 'POST', {id: userId, confirmed: true})
			.success(function() {
				noty({
					text: $filter('translate')('NOTIFICATIONS.COLLEAGUE_REQUEST_ACCEPTED'),
					type: 'success'
				});
			})
			.error(function() {
				principal.redirect();
			});
	};

	API.declineRequest = function(userId) {
		return apiRequest('users/me/colleagues/requests/in', 'POST', {id: userId, confirmed: false})
			.success(function() {
				noty({
					text: $filter('translate')('NOTIFICATIONS.COLLEAGUE_REQUEST_REJECTED'),
					type: 'success'
				});
			})
			.error(function() {
				principal.redirect();
			});
	};


	return API;
});
