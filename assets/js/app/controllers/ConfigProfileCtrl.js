angular.module('HPApp').controller('ConfigProfileCtrl', function(
	$scope, $r, $filter,
	redirect, sharedData, checkUserParams, notifyErrors,
	ProfileFactory,
	usersAPI, colleaguesAPI
) {

	if (checkUserParams.isRoleAndEmailExist()) {
		redirect.toSnaps();
	}



	$scope.model = {
		suggestions: null,
		isEmailFieldVisible: !sharedData.get('user.sv.email'),
		isRoleFieldVisible: !sharedData.get('user.sv.role'),
		roles: [
			{value: 'Journalist', label: 'COMMON.ROLES.JOURNALIST'},
			{value: 'Photographer', label: 'COMMON.ROLES.PHOTOGRAPHER'},
			{value: 'Videographer', label: 'COMMON.ROLES.VIDEOGRAPHER'},
			{value: 'Fixer', label: 'COMMON.ROLES.FIXER'},
			{value: 'Expert', label: 'COMMON.ROLES.EXPERT'},
			{value: 'Editor', label: 'COMMON.ROLES.EDITOR_MEDIA_OUTLET'},
			{value: 'PR', label: 'COMMON.ROLES.PR'}
		],
		form: {
			email: null,
			role: null
		}
	};



	$scope.submit = function() {
		var params = {};

		if ($scope.model.isEmailFieldVisible) {
			params.email = $scope.model.form.email;
		}

		if ($scope.model.isRoleFieldVisible) {
			params.role = $scope.model.form.role;
		}

		usersAPI.update(null, params)
			.success(redirect.toSnaps)
			.error(notifyErrors);
	};

	$scope.addColleague = function(user, index) {
		colleaguesAPI.sendRequest(user.id).success(function() {
			$scope.model.suggestions.splice(index, 1);
			noty({
				text: $filter('translate')('NOTIFICATIONS.REQUEST_SENT'),
				type: 'success'
			});
		});
	};

	$scope.hideColleague = function() {

	};


	$r(ProfileFactory.getSuggestionsData())($scope, 'model.suggestions');

});
