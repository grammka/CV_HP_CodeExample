angular.module('systemComponent', []);

angular.module('systemComponent')
	.service('$r', function($parse) {
		// $r(api.get())($scope, 'variableName');

		return function(promise) {
			return function(context, variable) {
				return promise.then(function(data) {
					$parse(variable).assign(context, data);
					return data;
				});
			}
		}
	});
