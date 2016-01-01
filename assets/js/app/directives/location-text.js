angular.module('HPApp').directive('locationText', function() {
	return {
		restrict: 'E',
		scope: {
			model: '='
		},
		link: function($scope, $element) {

			var location = '';

			if (!$scope.model.type || $scope.model.type == 'city') {
				if ($scope.model.name) {
					location += $scope.model.name;
				}

				if ($scope.model.name && $scope.model.country) {
					location += ', ';
				}

				if ($scope.model.country) {
					location += $scope.model.country;
				}
			} else if ($scope.model.type == 'country') {
				location += $scope.model.name;
			}

			$element.replaceWith(location);

		}
	};
});
