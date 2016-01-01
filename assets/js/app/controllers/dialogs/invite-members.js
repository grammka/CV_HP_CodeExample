angular.module('HPApp').controller('DialogInviteMembersCtrl', function(
	$scope, $filter,
    staticData,
    usersAPI
) {

	$scope.model = {
		// TODO change this on OPTIONS.ROLES
		//roles: staticData.getUserRolesOptions(),
		roles: [
			{value: 'Journalist', label: 'COMMON.ROLES.JOURNALIST'},
			{value: 'Photographer', label: 'COMMON.ROLES.PHOTOGRAPHER'},
			{value: 'Videographer', label: 'COMMON.ROLES.VIDEOGRAPHER'},
			{value: 'Fixer', label: 'COMMON.ROLES.FIXER'},
			{value: 'Expert', label: 'COMMON.ROLES.EXPERT'},
			{value: 'Editor', label: 'COMMON.ROLES.EDITOR_MEDIA_OUTLET'},
			{value: 'PR', label: 'COMMON.ROLES.PR'},
			{value: 'NGO', label: 'COMMON.ROLES.NGO'}
		],
		hackPacks: staticData.get('hackpacks'),
		form: {
			name: null,
			email: null,
			role: null,
			hackpack: null
		}
	};



	$scope.inviteMember = function() {
		usersAPI.invite($scope.model.form).success(function() {
			$scope.closeThisDialog();
			noty({
				text: $filter('translate')('NOTIFICATIONS.NEW_MEMBER_INVITED.SUCCESS'),
				type: 'success'
			});
		});
	};

});
