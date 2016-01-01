angular.module('HPApp').directive('modelValuesCompare', function() {
	return {
		require: 'ngModel',
		scope: {
			modelValuesCompare: '='
		},
		link: function($scope, $element, $attrs, modelCtrl) {
			
			$scope.$watch(function() {
				var combined;

				if ($scope.modelValuesCompare || modelCtrl.$viewValue) {
					combined = $scope.modelValuesCompare + '_' + modelCtrl.$viewValue;
				}
				
				return combined;
			}, function(value) {
				if (value) {
					modelCtrl.$parsers.unshift(function(viewValue) {
						var origin = $scope.modelValuesCompare;

						if (origin !== viewValue) {
							modelCtrl.$setValidity('modelValuesCompare', false);
							return undefined;
						} else {
							modelCtrl.$setValidity('modelValuesCompare', true);
							return viewValue;
						}
					});
				}
			});
		}
	};
});
