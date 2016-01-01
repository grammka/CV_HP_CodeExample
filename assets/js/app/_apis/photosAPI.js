angular.module('HPApp').factory('photosAPI', function(
	$rootScope,
	Upload, notifyErrors
) {

	var API = {};


	API.upload = function(path, file) {
		return Upload.upload({
			url: $rootScope.apiPath + path,
			method: 'POST',
			file: {'photo': file},
			withCredentials: true
		})
			.error(function(response) {
				notifyErrors(response);
			});
	};


	return API;

});
