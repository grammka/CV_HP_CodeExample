angular.module('HPApp').controller('OrganizationUsersCtrl', function(
	$scope, $stateParams, $state, $filter, $timeout,
	ngDialog, sharedData, confirmClickDialog,
	organization,
	usersAPI, companiesAPI
) {

	var _INVITE_MEMBER_FORM = {
		email: null,
		role: null,
		is_admin: false
	};

	$scope.model = {
		currUserId: sharedData.get('user.sv.id'),
		organization: organization,
		users: null,
		searchForHackPackMemberQuery: null,
		searchHackPackMembersResult: null,
		editing: false,
		form: angular.copy(_INVITE_MEMBER_FORM)
	};



	function editUser(user) {
		var dialog = ngDialog.open({
			className: 'ngdialog-theme-default ngdialog_edit-user',
			templateUrl: 'dialogs/organization-edit-admin.html',
			controller: 'DialogsOrganizationEditAdminCtrl',
			resolve: {
				user: function() {
					return angular.copy(user);
				}
			}
		});

		dialog.closePromise.then(function(data) {
			if (data.value && typeof data.value == 'object') {
				companiesAPI.updateAdmin($stateParams.organizationId, user.id, data.value).success(function(permissions) {
					user.permissions = permissions;
				});
			}
		});
	}

	$scope.editUser = editUser;

	$scope.toggleIsAdminStatus = function(user) {
		if (!user.permissions.is_admin) {
			confirmClickDialog().then(function(response) {
				if (response.value === true) {
					companiesAPI.updateAdmin($stateParams.organizationId, user.id, {is_admin: false});
				} else {
					user.permissions.is_admin = true;
				}
			});
		} else {
			companiesAPI.updateAdmin($stateParams.organizationId, user.id, {is_admin: true}).success(function() {
				editUser(user);
			});
		}
	};

	$scope.edit = function() {
		$scope.model.editing = true;
	};

	$scope.cancel = function() {
		$scope.model.editing = false;
		$scope.model.form = angular.copy(_INVITE_MEMBER_FORM);
		if (searchForHackPackMemberTimer) {
			$timeout.cancel(searchForHackPackMemberTimer);
		}
		$scope.model.searchForHackPackMemberQuery = null;
		$scope.model.searchHackPackMembersResult = null;
	};

	var searchForHackPackMemberTimer;
	$scope.searchForHackPackMember = function() {
		if (searchForHackPackMemberTimer) {
			$timeout.cancel(searchForHackPackMemberTimer);
		}

		if ($scope.model.searchForHackPackMemberQuery.length > 2) {
			searchForHackPackMemberTimer = $timeout(function() {
				searchForHackPackMemberTimer = $timeout(function() {
					usersAPI.getList({search: $scope.model.searchForHackPackMemberQuery, roles: ['Expert', 'PR']}).success(function(response) {
						$timeout(function() {
							$scope.model.searchHackPackMembersResult = response.results;
						});
					});
				});
			}, 100);
		} else {
			$scope.model.searchHackPackMembersResult = null;
		}
	};

	$scope.inviteHackPackMember = function(user) {
		companiesAPI.inviteHackPackMember($stateParams.organizationId, user.id)
			.success(function() {
				noty({
					text: $filter('translate')('NOTIFICATIONS.NEW_COMPANY_MEMBER_INVITED.SUCCESS'),
					type: 'success'
				});
				companiesAPI.updateAdmin($stateParams.organizationId, user.id, {is_admin: true});
			})
			.finally(function() {
				$scope.cancel();
			});
	};

	$scope.inviteMemberViaEmail = function() {
		if ($scope.model.memberForm.email && $scope.model.memberForm.role) {
			$scope.model.memberForm.organization_id = $stateParams.organizationId;
			$scope.model.memberForm.is_admin = $scope.model.memberForm.role == 'PR';

			companiesAPI.inviteUserViaEmail($stateParams.organizationId, $scope.model.memberForm)
				.success(function() {
					noty({
						text: $filter('translate')('NOTIFICATIONS.NEW_COMPANY_MEMBER_INVITED.SUCCESS'),
						type: 'success'
					});
				})
				.finally(function() {
					$scope.cancel();
				});
		}
	};

	$scope.createNewExpertProfile = function() {
		if ($scope.model.form.first_name && $scope.model.form.last_name) {
			companiesAPI.createExpertPage($stateParams.organizationId, $scope.model.form).success(function(expert) {
				$location.path('/profile/' + expert.id + '/principal/');
				$scope.cancel();
			});
		}
	};

	$scope.removeMember = function(userId) {
		companiesAPI.removeMember($stateParams.organizationId, userId).success(function() {
			$scope.model.members.splice(index, 1);
		});
	};

	$scope.leave = function() {
		companiesAPI.leave($stateParams.organizationId).success(function() {
			$state.go('ws.profile.principal', {userId: $scope.model.currUserId}, {reload: true});
		});
	};



	companiesAPI.getUsers($stateParams.organizationId).success(function(response) {
		$scope.model.users = response;
	});

});

