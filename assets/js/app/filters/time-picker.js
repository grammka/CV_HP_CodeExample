angular.module('HPApp')
	.service('timeOptions', function() {
		var result = [];

		for (var i = 1; i <= 24; i++) {
			var add0 = (i < 10 || i > 12 && i < 22 ? '0' : ''),
				label = (i <= 12 ? i : (i - 12)) + (i < 12 || i == 24 ? ' AM' : ' PM');

			result.push({label: label, value: i});
		}

		return result;
	})
	.filter('timePicker', function(timeOptions) {
		return timeOptions;
	});
