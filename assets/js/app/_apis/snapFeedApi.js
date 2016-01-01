angular.module('HPApp').factory('snapFeedAPI', function(
	$rootScope, $http,
	sharedData, apiRequest, notifyErrors,
	photosAPI
) {
	var API = {};


	// Snaps List ====================================================================== /

	API.getOpenedSnaps = function(filters) {
		return apiRequest('snapfeed/open_list', 'GET', filters || {});
	};

	API.getList = function(filters) {
		return apiRequest('snapfeed', 'GET', filters || {});
	};

	API.getNextPageList = function(url, filters) {
		return $http.get(url, {params: filters || {}});
	};

	API.getSnap = function(snapId) {
		return apiRequest('snapfeed/' + snapId);
	};

	API.hideSnap = function(snapId) {
		return apiRequest('snapfeed/hidden', 'POST', {item: snapId});
	};

	API.createSnap = function(data) {
		return apiRequest('snapfeed', 'POST', data);
	};

	API.uploadPhoto = function(snapId, file) {
		return photosAPI.upload('snapfeed/' + snapId + '/photos/', file);
	};

	API.removePhoto = function(photoId) {
		return apiRequest('snapfeed/photos/' + photoId, 'DELETE');
	};

	API.removeSnap = function(snapId) {
		return apiRequest('snapfeed/' + snapId, 'DELETE');
	};

	API.updateSnap = function(snapId, data) {
		return apiRequest('snapfeed/' + snapId, 'PATCH', data);
	};

	API.publishSnap = function(snapId) {
		return apiRequest('snapfeed/' + snapId, 'PATCH', {is_published: true});
	};

	API.unpublishSnap = function(snapId) {
		return apiRequest('snapfeed/' + snapId, 'PATCH', {is_published: false});
	};

	API.getMySnaps = function() {
		return apiRequest('snapfeed/my');
	};

	API.getOptions = function() {
		return apiRequest('snapfeed/options');
	};


	// Subscription ==================================================================== /

	API.getSubscriptions = function() {
		return apiRequest('snapfeed/subscription');
	};

	/**
	 *
	 * @param data {{ tags: array, categories: array, languages: array, countries: array }}
	 * @returns {*}
	 */
	API.subscribe = function(data) {
		return apiRequest('snapfeed/subscription', 'PATCH', data);
	};

	API.unsubscribe = function() {
		return apiRequest('snapfeed/subscription', 'DELETE');
	};


	// Notifications ================================================================== /

	API.getNotifications = function() {
		return apiRequest('snapfeed/notification_settings');
	};

	/**
	 *
	 * @param data {{ weekdays: array, times: array }}
	 * @returns {*}
	 */
	API.setNotifications = function(data) {
		return apiRequest('snapfeed/notification_settings', 'PATCH', data);
	};


	// Snap Page ====================================================================== /

	API.sendMessage = function(snapId, text) {
		return apiRequest('snapfeed/' + snapId + '/comments', 'POST', {text: text})
			.error(notifyErrors);
	};

	API.sendComment = function(snapId, userId, text) {
		return apiRequest('snapfeed/' + snapId + '/comments', 'POST', {text: text, target: userId});
	};


	return API;
});
