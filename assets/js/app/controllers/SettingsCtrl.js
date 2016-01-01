angular.module('HPApp').controller('SettingsCtrl', function(
	$scope, $translate, $filter,
	localization, sharedData, staticData, snapFeedOptions,
	authAPI, usersAPI, notificationsAPI
) {

	var _PASSWORD_FORM = {
			old_password: null,
			new_password: null,
			repeat_new_password: null
		};

	$scope.model = {
		user: sharedData.get('user.sv'),

		interfaceLanguageOptions: [{label: 'English', value: 'enUS'}, {label: 'Русский', value: 'ruRU'}],

		notifications: (function() {
			var notifications = {};

			angular.forEach(sharedData.user.sv.notification_settings, function(value, key) {
				notifications[key] = {
					label: 'SETTINGS.EMAIL_NOTIFICATIONS.FORM.' + (key.toUpperCase()),
					value: value
				};
			});

			return notifications;
		})(),

		changePassForm: angular.copy(_PASSWORD_FORM),
		changeEmailForm: {
			email: sharedData.get('user.sv.email') || null,
			password: null
		}
	};



	$scope.switchInterfaceLanguage = function() {
		usersAPI.update('me', {interface_language: $scope.model.user.interface_language}).success(function() {
			localization.update($scope.model.user.interface_language);
			staticData.load(true);
			snapFeedOptions.load(true);
		});
	};

	$scope.toggleNotification = function(key) {
		var data = {};

		data[key] = $scope.model.notifications[key].value;

		notificationsAPI.set(data).success(function() {
			sharedData.user.sv.notification_settings[key] = data[key];
		});
	};

	$scope.submitChangePass = function() {
		var data = {old_password: $scope.model.changePassForm.old_password, new_password: $scope.model.changePassForm.new_password};

		authAPI.changePassword(data).success(function() {
			$scope.model.changePassForm = angular.copy(_PASSWORD_FORM);
			noty({
				text: $filter('translate')('NOTIFICATIONS.PASSWORD_CHANGE.SUCCESS'),
				type: 'success'
			});
		});
	};

	$scope.resetPassword = function() {
		authAPI.resetPassword(sharedData.get('user.sv.email'));
	};

	$scope.submitChangeEmail = function() {
		authAPI.changeEmail($scope.model.changeEmailForm).success(function() {
			noty({
				text: $filter('translate')('NOTIFICATIONS.EMAIL_CHANGE.SUCCESS', {email: $scope.model.changeEmailForm.email}),
				type: 'success'
			});
		});
	};

});
