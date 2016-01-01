angular.module('HPApp').controller('ProfilePrivacyCtrl', function(
	$scope, $r, $stateParams, $filter,
	sharedData,
	user,
	usersAPI
) {

	var _FORM = {
		privacy_level: null,
		pseudonym: null
	};

	$scope.model = {
		//currUserId: sharedData.get('user.sv.id'),
		//userId: $stateParams.userId || sharedData.get('user.sv.id'),
		user: user,

		privacyLevelOptions: {
			pub: {
				value: 'pub',
				label: 'PROFILE.PRIVACY_SETTINGS.FORM.PRIVACY_LEVEL.SELECT_OPTIONS.PUBLIC.LABEL',
				desc: 'PROFILE.PRIVACY_SETTINGS.FORM.PRIVACY_LEVEL.SELECT_OPTIONS.PUBLIC.DESC'
			},
			sec: {
				value: 'sec',
				label: 'PROFILE.PRIVACY_SETTINGS.FORM.PRIVACY_LEVEL.SELECT_OPTIONS.SECURE.LABEL',
				desc: 'PROFILE.PRIVACY_SETTINGS.FORM.PRIVACY_LEVEL.SELECT_OPTIONS.SECURE.DESC'
			},
			top: {
				value: 'top',
				label: 'PROFILE.PRIVACY_SETTINGS.FORM.PRIVACY_LEVEL.SELECT_OPTIONS.TOP_SECRET.LABEL',
				desc: 'PROFILE.PRIVACY_SETTINGS.FORM.PRIVACY_LEVEL.SELECT_OPTIONS.TOP_SECRET.DESC'
			}
		},
		form: angular.copy(_FORM)
	};



	/*

	 (model.currUserId == model.user.id || model.user.is_admin) &&
	 !RC('Expert', model.mainInfoForm.role) &&
	 !RC('PR', model.mainInfoForm.role) && !RC('NGO', model.mainInfoForm.role)

	 */

	$scope.save = function() {
		usersAPI.update($stateParams.userId, $scope.model.form)
			.success(function(response) {
				$scope.model.user = response;
				noty({
					text: $filter('translate')('NOTIFICATIONS.CHANGES_SUCCESSFULLY_SAVED'),
					type: 'success'
				});
			});
	};



	$scope.model.form.privacy_level = $scope.model.user.privacy_level;
	$scope.model.form.pseudonym = $scope.model.user.pseudonym;

});
