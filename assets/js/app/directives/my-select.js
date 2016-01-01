angular.module('HPApp').directive('mySelect', function($timeout, serverValidation) {
	return {
		restrict: 'E',
		require: '^ngModel',
		scope: {
			dynamicModel: '=',
			ngModel: '=',
			options: '=',
			config: '=',
			placeholder: '@',
			create: '@'
		},
		template: '<input type="text">',
		replace: true,

		link: function($scope, $element, $attrs, modelCtrl) {

			var $select, selectize;

			function updateModel() {
				serverValidation.cleanField($element);
				modelCtrl.$setViewValue($element.val());
			}

			$scope.$watch('options', function(options) {
				if (options) {
					$select = $element.selectize(angular.extend({
						options: options,
						valueField: 'value',
						labelField: 'label',
						searchField: 'label',
						sortField: 'label',
						placeholder: $scope.placeholder,
						create: $scope.create || false,
						maxItems: 1,
						onChange: updateModel
					}, $scope.config || {}));

					selectize = $select[0].selectize;

					if ($scope.ngModel) {
						selectize.setValue($scope.ngModel);
						updateModel();
					}
				}
			});

			if ($attrs.dynamicModel) {
				$scope.$watch('dynamicModel', function (newVal, oldVal) {
					if (newVal != oldVal) {
						selectize.setValue(newVal);
						updateModel();
					}
				});
			}

		}
	};
});
