angular.module('HPApp').factory('feedbackAPI', function(apiRequest) {
	var API = {};


	API.getList = function(userId) {
		return apiRequest('colleague_feedback/' + userId);
	};

	/**
	 * @param userId
	 * @param params {{ category: String, rating: Number, comment: String }}
	 * @returns {*}
	 */
	API.post = function(userId, params) {
		return apiRequest('colleague_feedback/' + userId, 'POST', params);
	};

	/**
	 * @param userId
	 * @param feedbackId
	 * @param params {{ category: String, rating: Number, comment: String }}
	 * @returns {*}
	 */
	API.update = function(userId, feedbackId, params) {
		return apiRequest('colleague_feedback/' + userId + '/' + feedbackId, 'PATCH', params);
	};

	API.getOptions = function(userId) {
		return apiRequest('colleague_feedback/' + userId + '/options');
	};


	return API;
});
