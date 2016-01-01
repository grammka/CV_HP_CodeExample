angular.module('HPApp').directive('myMultipleSelect', function($timeout) {
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
				var selectedItems = selectize.items,
					result = [];

				if (typeof selectedItems == 'string') {
					mixpanel.track('Warning: MultipleSelect items format is string', selectedItems);
					result = selectedItems.split(',');
				} else {
					result = selectedItems;
				}

				$timeout(function() {
					modelCtrl.$setViewValue(result);
				});
			}

			$scope.$watch('options', function(options) {
				if (options) {
					$select = $element.selectize(angular.extend({
						plugins: ['remove_button'],
						persist: false,
						options: options,
						valueField: 'value',
						labelField: 'label',
						searchField: 'label',
						create: $scope.create || false,
						placeholder: $scope.placeholder,
						onChange: updateModel,
						onBlur: updateModel
					}, $scope.config || {}));

					selectize = $select[0].selectize;

					console.log($scope.ngModel);

					if ($scope.ngModel) {
						selectize.setValue($scope.ngModel);
						updateModel();
					}
				}
			});

			if ($attrs.dynamicModel) {
				$scope.$watch('dynamicModel', function (newVal, oldVal) {
					if (typeof oldVal == 'string') {
						oldVal = oldVal.split(',');
					}

					if (newVal == null || (newVal && newVal instanceof Array && !newVal.equals(oldVal))) {
						selectize.setValue(newVal || []);
						updateModel();
					}
				});
			}

		}
	};
});
