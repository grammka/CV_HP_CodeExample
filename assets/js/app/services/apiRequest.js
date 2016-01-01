angular.module('HPApp').service('apiRequest', function($rootScope, $http) {
	return function(path, method, data, headers) {
		var options = {
			url: $rootScope.apiPath + path + '/',
			method: method || 'GET',
			headers: headers || {}
		};

		if (!method || method == 'GET') {
			options.params = data;
		} else {
			options.data = data;
		}

		return $http(options);
	};
});
