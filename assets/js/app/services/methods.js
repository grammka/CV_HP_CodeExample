angular.module('HPApp').factory('methods', function() {
	return {
		generateSelectizeOptions: function(arr) {
			return arr.map(function(label) {
				return {value: label, label: label};
			});
		}
	};
});
