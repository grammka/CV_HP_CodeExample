angular.module('HPApp').factory('staticData', function(
	$q,
	apiRequest
) {

	var StaticData = {}, data = null;


	StaticData.checkLoaded = function() {
		return !!Object.keys(data).length;
	};

	StaticData.load = function(force) {
		var deferred = $q.defer();

		if (data && !force) {
			deferred.resolve(data);
		} else {
			console.info('static Data is loading...');

			apiRequest('options').success(function(response) {
				console.info('static Data loaded');

				data = response;
				deferred.resolve(response);
			});
		}

		return deferred.promise;
	};

	StaticData.get = function(key) {
		return data[key];
	};

	StaticData.getSelectOptions = function(key) {
		if (data[key]) {
			return data[key].map(function(label) {
				return {value: label, label: label};
			});
		}
	};

	StaticData.getSelectOptionsByArray = function(arr) {
		return arr.map(function(item) {
			return {value: item, label: item};
		});
	};

	StaticData.getUserRolesOptions = function() {
		return data.roles.map(function(role) {
			return {value: role.name, label: role.label};
		});
	};


	return StaticData;

});
