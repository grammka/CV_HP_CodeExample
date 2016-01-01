angular.module('HPApp').directive('mySelectize', function(serverValidation) {
	return {
		restrict: 'E',
		require: '^ngModel',
		scope: {
			ngModel: '=',
			config: '='
		},
		template: '<input type="text">',
		replace: true,

		link: function($scope, $element, $attrs, modelCtrl) {

			function updateModel() {
				serverValidation.cleanField($element);

				var value = $element.val();

				modelCtrl.$setViewValue(value ? $element.val().split(',') : []);
			}

			var _config = {
				onChange: updateModel,
				onBlur: updateModel
			};

			if ($scope.ngModel) {
				_config.items = $scope.ngModel.slice();
			}

			$element.selectize(angular.extend(_config, $scope.config));

		}
	};
});
