angular.module('HPApp').filter('replaceHTML', function() {
	return function(value, justSpaces) {
		value = value || '';

		if (justSpaces) {
			return value.replace(/\&nbsp\;?/g, ' ');
		} else {
			return value.replace(/\<[^\>]+?\>/g, ' ').replace(/\&nbsp\;?/g, ' ').replace(/\s+/g, ' ');
		}
	};
});
