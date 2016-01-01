angular.module('HPApp').directive('mySelectCompany', function(
	$timeout, $filter,
	serverValidation,
	companiesAPI
) {
	return {
		restrict: 'E',
		require: '^ngModel',
		scope: {
			dynamicModel: '=',
			placeholder: '@',
			onChange: '&',
			onEmptySearch: '&'
		},
		template: '<input type="text">',
		replace: true,

		link: function($scope, $element, $attrs, modelCtrl) {

			var $select, selectize, timer, placeholder, optionsFound;


			placeholder = typeof $scope.placeholder == 'string' ? $scope.placeholder : $filter('translate')('PLACEHOLDERS.SEARCH_COMPANIES_BY_WEBSITE');


			function updateModel() {
				var selectedItem, values;

				serverValidation.cleanField($element);

				values = selectize.getValue();
				values = $.isArray(values) ? values : [values];

				modelCtrl.$setViewValue($.map(values, function(value) {
					selectedItem = selectize.options[value];
					return selectedItem;
				})[0]);

				if (selectedItem) {
					if (optionsFound && optionsFound.length) {
						if (typeof $scope.onChange == 'function') {
							$scope.onChange({
								selectedItem: selectedItem
							});
						}
					} else if (typeof $scope.onEmptySearch == 'function') {
						$scope.onEmptySearch({
							selectedItem: selectedItem
						});
					}
				}
			}

			function setDefaultOption(options) {
				selectize.addOption(options);
				selectize.addItem(options.id);
			}


			$select = $element.selectize({
				create: true,
				createOnBlur: true,
				valueField: 'id',
				labelField: 'website',
				searchField: ['website'],
				options: [],
				hideSelected: true,
				openOnFocus: false,
				placeholder: placeholder,
				maxItems: 1,
				render: {
					option: function(item) {
						return '\
							<div>\
								<b>' + item.name + '</b>\
								<span class="hp_8"></span>\
								<span class="t-text_light">' + item.website + '</span>\
							</div>\
						';
					},
					option_create: function() {
						return '';
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
						companiesAPI.get({website: query}).success(function(options) {
							optionsFound = options;

							if (options && options.length) {
								angular.forEach(options, function(option) {
									option.query = query;
								});

								selectize.clearOptions();
								callback(options);
							} else if (typeof $scope.onEmptySearch == 'function') {
								$scope.onEmptySearch();
							}
						});
					}, 50);
				},
				onChange: updateModel,
				onBlur: function() {
					return false;
				}
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
