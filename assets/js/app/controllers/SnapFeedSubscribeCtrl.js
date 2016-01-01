angular.module('HPApp').controller('SnapFeedSubscribeCtrl', function(
	$scope, timeOptions, $filter,
	snapFeedAPI, snapFeedOptions, staticData
) {

	var _DEFAULT_NOTIFICATIONS_WEEKDAYS = {
			1: {label: 'COMMON.FULL_DAYS.MONDAY', value: 1},
			2: {label: 'COMMON.FULL_DAYS.TUESDAY', value: 1},
			3: {label: 'COMMON.FULL_DAYS.WEDNESDAY', value: 1},
			4: {label: 'COMMON.FULL_DAYS.THURSDAY', value: 1},
			5: {label: 'COMMON.FULL_DAYS.FRIDAY', value: 1},
			6: {label: 'COMMON.FULL_DAYS.SATURDAY', value: 1},
			7: {label: 'COMMON.FULL_DAYS.SUNDAY', value: 1}
		},
		_FILTER_FORM = {
			categories: [],
			tags: [],
			countries: [],
			languages: []
		};

	$scope.model = {
		categoriesSelectizeOptions: snapFeedOptions.getSelectOptions('subscribe_categories'),
		languagesSelectizeOptions: staticData.getSelectOptions('languages'),
		tagsSelectizeOptions: snapFeedOptions.getSelectOptions('tags'),
		timeOptions: timeOptions,

		forms: {
			SnapNotificationsForm: null
		},
		filterForm: angular.copy(_FILTER_FORM),
		notifyForm: {
			weekdays: (function() {
				var weekdays = angular.copy(_DEFAULT_NOTIFICATIONS_WEEKDAYS);
				angular.forEach(weekdays, function(item) {
					item.value = 0;
				});
				return weekdays;
			})(),
			time: 12
		}
	};



	$scope.subscribe = function() {
		if (
			$scope.model.forms.SnapSubscribeForm.$dirty && (
				$scope.model.filterForm.categories.length
				|| $scope.model.filterForm.tags.length
				|| $scope.model.filterForm.languages.length
			)
		) {
			snapFeedAPI.subscribe($scope.model.filterForm).success(function() {
				noty({
					text: $filter('translate')('NOTIFICATIONS.SNAP_SUBSCRIBE_CHANGED.SUCCESS'),
					type: 'success'
				});
			});
		}
	};

	$scope.unsubscribe = function() {
		snapFeedAPI.unsubscribe().success(function() {
			$scope.model.filterForm = angular.copy(_FILTER_FORM);
			$scope.model.forms.SnapSubscribeForm.$setPristine();
			noty({
				text: $filter('translate')('NOTIFICATIONS.SNAP_SUBSCRIBE_CANCELED.SUCCESS'),
				type: 'success'
			});
		});
	};

	$scope.saveNotificationsSettings = function() {
		var data = {
			weekdays: '',
			times: []
		};

		angular.forEach($scope.model.notifyForm.weekdays, function(day, index) {
			if (day.value) {
				data.weekdays += index;
			}
		});

		data.times.push($scope.model.notifyForm.time + ':00');

		snapFeedAPI.setNotifications(data).success(function() {
			$scope.model.forms.SnapNotificationsForm.$setPristine();
			noty({
				text: $filter('translate')('NOTIFICATIONS.SNAP_NOTIFICATIONS_TIME_CHANGED.SUCCESS'),
				type: 'success'
			});
		});
	};



	snapFeedAPI.getNotifications().success(function(response) {
		if (response.weekdays) {
			var weekdays = response.weekdays.split('');

			angular.forEach(weekdays, function(index) {
				$scope.model.notifyForm.weekdays[index].value = 1;
			});
		} else {
			$scope.model.notifyForm.weekdays = angular.copy(_DEFAULT_NOTIFICATIONS_WEEKDAYS);
		}

		if (response.times && response.times.length) {
			$scope.model.notifyForm.time = +response.times[0].match(/^\d+/)[0];
		}
	});



	snapFeedAPI.getSubscriptions().success(function(filters) {
		angular.forEach(filters, function(items, key) {
			$scope.model.filterForm[key] = items;
		});
	});

});
