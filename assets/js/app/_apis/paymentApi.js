angular.module('HPApp').factory('paymentAPI', function(apiRequest) {
	var API = {};


	API.getToken = function() {
		return apiRequest('options/payment_token');
	};


	return API;
});
