angular.module('HPApp').filter('location', function() {
	return function(model) {
		var location = '';

		if (model.city) {
			location += model.city;
		}

		if (model.city && model.country) {
			location += ', ';
		}

		if (model.country) {
			location += model.country;
		}

		return location;
	};
});
