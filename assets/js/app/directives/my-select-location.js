angular.module('HPApp').directive('mySelectLocation', function(
	$timeout, $filter,
	serverValidation,
	optionsAPI
) {
	return {
		restrict: 'E',
		require: '^ngModel',
		scope: {
			dynamicModel: '=',
			defaultOption: '=',
			placeholder: '@',
			method: '@'
		},
		template: '<input type="text">',
		replace: true,

		link: function($scope, $element, $attrs, modelCtrl) {

			var $select, selectize, timer, method, placeholder;


			placeholder = typeof $scope.placeholder == 'string' ? $scope.placeholder : $filter('translate')('PLACEHOLDERS.LOCATION');


			if (!$scope.method || $scope.method == 'cities') {
				method = 'getCitiesLocations';
			} else if ($scope.method == 'countries') {
				method = 'getCountriesLocations';
			} else if ($scope.method == 'full') {
				method = 'getAllLocations';
			} else {
				return console.error('wrong type passed to mySelectLocation directive');
			}


			function updateModel() {
				serverValidation.cleanField($element);

				var values = selectize.getValue();

				values = $.isArray(values) ? values : [values];

				modelCtrl.$setViewValue($.map(values, function(value) {
					return selectize.options[value];
				})[0]);
			}

			function setDefaultOption(options) {
				$scope.defaultOption.fullName = options.name + (options.country ? (', ' + options.country) : '');

				selectize.addOption(options);
				selectize.addItem(options.id);
			}


			$select = $element.selectize({
				valueField: 'id',
				labelField: 'fullName',
				searchField: ['query'],
				options: [],
				create: false,
				hideSelected: true,
				openOnFocus: false,
				placeholder: placeholder,
				maxItems: 1,
				render: {
					option: function(item) {
						item.fullName = item.name + (item.country ? (', ' + item.country) : '');

						return '\
							<div>\
								<b>' + item.fullName + '</b>\
							</div>\
						';
					}
				},
				load: function(query, callback) {
					if (timer) {
						$timeout.cancel(timer);
					}

					if (!query.length) {
						return callback();
					}

					timer = $timeout(function() {
						optionsAPI[method](query).success(function(options) {
							angular.forEach(options, function(option) {
								option.query = query;
							});

							selectize.clearOptions();
							callback(options);
						});
					}, 50);
				},
				onChange: updateModel,
				onBlur: updateModel
			});

			selectize = $select[0].selectize;


			if ($attrs.defaultOption && typeof $scope.defaultOption == 'object') {
				setDefaultOption($scope.defaultOption);
			}


			// TODO check if this needed
			if ($attrs.dynamicModel) {
				$scope.$watch('dynamicModel', function(newVal, oldVal) {
					if (newVal == null) {
						selectize.setValue(null);
						updateModel();
					}
				});
			}

		}
	};
});
