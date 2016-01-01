angular.module('HPApp').filter('options', function() {
    return function(input) {
		return input.map(function(el) {
			return {value: el, label: el}
		});
    };
});
