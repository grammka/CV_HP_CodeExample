angular.module('HPApp').filter('join', function() {
	return function(value, split) {
		return value.join(split || ', ')
	};
});
