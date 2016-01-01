angular.module('HPApp').filter('objLength', function() {
	return function(obj) {
		return Object.keys(obj).length;
	};
});
