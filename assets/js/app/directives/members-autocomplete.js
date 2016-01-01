angular.module('HPApp').directive('membersAutocomplete', function(
	$timeout, avatar,
	sharedData,
	usersAPI
) {
	return {
		resctrict: 'E',
		scope: {
			placeholder: '@',
			onItemSelected: '&',
			ajaxParams: '='
		},
		template: '<input type="text" ng-model="model.searchMessages" />',
		replace: true,

		link: function($scope, $element) {

			var currUserId, $select, selectize, timer;

			currUserId = sharedData.get('user.sv.id');

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
				valueField: 'id',
				labelField: 'full_name',
				searchField: ['first_name', 'last_name', 'full_name'],
				sortField: 'text',
				placeholder: $scope.placeholder || 'Start chatting with...',
				maxItems: 1,
				hideSelected: true,
				openOnFocus: false,
				render: {
					option: function(member) {
						if (member.id != currUserId) {
							return '\
								<div class="members-autocomplete__item">\
									<div class="members-autocomplete__item__avatar">' + avatar(member) + '</div>\
									<div class="members-autocomplete__item__username">' + member.full_name + '</div>\
								</div>\
							';
						} else {
							return '';
						}
					}
				},
				load: function(query, callback) {
					if (timer) {
						$timeout.cancel(timer);
					}

					if (query.length > 2) {
						timer = $timeout(function() {
							cleanOptions();

							var data = {search: query};

							if ($scope.ajaxParams) {
								angular.extend(data, $scope.ajaxParams);
							}

							usersAPI.getList(data).success(function(response) {
								callback(response.results);
							});
						});
					} else {
						cleanOptions();

						return callback();
					}
				},
				onChange: function(userId) {
					$scope.onItemSelected({
						user: selectize.options[userId]
					});
				},
				onFocus: cleanOptions,
				onDropdownClose: cleanOptions
			});

			selectize = $select[0].selectize;

		}
	};
});
