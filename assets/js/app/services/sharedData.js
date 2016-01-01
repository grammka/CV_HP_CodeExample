var SharedData = {};

angular.module('HPApp').factory('sharedData', function($location, $parse) {

	SharedData.user = {
		sv: null
	};

	SharedData.organization = {
		sv: null
	};

	SharedData.set = function(key, value) {
		this[key].sv = value;
	};

	SharedData.get = function(key) {
		var obj = $parse(key)(SharedData);

		if (obj && obj.hasOwnProperty('sv')) return obj.sv;

		return obj;
	};


	return SharedData;

});
