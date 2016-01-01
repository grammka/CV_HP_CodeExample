angular.module('HPApp').directive('mySelectAffiliations', function($timeout, optionsAPI) {
	return {
		restrict: 'E',
		require: '^ngModel',
		scope: {
			defaultOptions: '=',
			placeholder: '@'
		},
		template: '<input type="text">',
		replace: true,

		link: function($scope, $element, $attrs, modelCtrl) {

			var $select, selectize, timer;

			function updateModel() {
				var options         = selectize.options,
					selectedItems   = selectize.items,
					result = [];

				if (typeof selectedItems == 'string') {
					mixpanel.track('Warning: AffiliationsSelect items format is string', selectedItems);
					selectedItems = selectedItems.split(',');
				}

				angular.forEach(selectedItems, function(name) {
					if (options[name].id) {
						result.push({name: name, id: options[name].id});
					} else {
						result.push({name: name});
					}
				});

				$timeout(function() {
					modelCtrl.$setViewValue(result);
				});
			}

			function cleanOptions() {
				var prevOptions = selectize.options,
					prevItems   = selectize.items;

				selectize.clearOptions();

				angular.forEach(prevItems, function(name) {
					selectize.addOption(prevOptions[name]);
					selectize.addItem(name);
				});
			}

			$select = $element.selectize({
				plugins: ['remove_button'],
				persist: false,
				valueField: 'name',
				labelField: 'name',
				searchField: ['query'],
				options: [],
				create: true,
				closeAfterSelect: true,
				hideSelected: true,
				openOnFocus: false,
				placeholder: $scope.placeholder || 'Type in your affiliations',
				render: {
					option: function(item) {
						return '<div><b>' + item.name + '</b></div>';
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
						cleanOptions();

						optionsAPI.getAffiliations(query).success(function(options) {
							angular.forEach(options, function(option) {
								option.query = query;
							});

							callback(options);
						});
					}, 50);
				},
				onFocus: cleanOptions,
				onDropdownClose: cleanOptions,
				onChange: updateModel,
				onBlur: updateModel
			});

			selectize = $select[0].selectize;

			if ($scope.defaultOptions) {
				angular.forEach($scope.defaultOptions, function(affiliation) {
					selectize.addOption(affiliation);
					selectize.addItem(affiliation.name);
				});
			}

		}
	};
});
