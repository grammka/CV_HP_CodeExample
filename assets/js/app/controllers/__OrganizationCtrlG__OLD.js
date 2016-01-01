angular.module('HPApp').controller('OrganizationCtrlgggg', function(
	$scope, $location, $stateParams,
	staticData, sharedData,
	companiesAPI
) {

	var _INVITE_MEMBER_FORM = {
		email: null,
		role: null,
		is_admin: false
	};

	$scope.model = {
		contentBaron: null,

		activeNavigItemIndex: 0,
		navig: [
			{id: '', title: 'Main info'},
			{id: '', title: 'Administrators'},
			{id: '', title: 'Experts'},
			//{id: '', title: 'Colleague feedback'}
		],

		organization: null,
		members: null,
		currUserId: sharedData.get('user.sv.id'),

		expertiseSelectOptions: staticData.getSelectOptions('expertise'),
		addAdminRolesOptions: [
			{value: 'Expert', label: 'COMMON.ROLES.EXPERT'},
			{value: 'PR', label: 'COMMON.ROLES.PR'},
		],

		mainInfoForm: null,
		mainInfoEditing: false,
		selectizeLocationObject: null,
		validateObject: null,
		validateMethods: null,

		memberForm: angular.copy(_INVITE_MEMBER_FORM),
		adminsEditing: false,
		expertsEditing: false
	};



	function setCompanyDataToForm() {
		$scope.model.mainInfoForm = angular.copy($scope.model.organization);

		angular.extend($scope.model.expertiseSelectOptions, staticData.getSelectOptionsByArray($scope.model.mainInfoForm.expertise));
	}



	$scope.onFixHeader = function(index) {
		$scope.model.activeNavigItemIndex = index;
	};

	$scope.scrollToSection = function(index) {
		// TODO revert scrolling to Tooltip Headers
		//$scope.model.contentBaron.fixHeaders.scrollTo(index);
	};



	// Main Info ------------------------------------------------------------------------- /

	$scope.uploadPhoto = function(files) {
		if (files.length) {
			companiesAPI.uploadPhoto($stateParams.organizationId, files[0]).success(function(response) {
				$scope.model.organization.photo = response.photo;
			});
		}
	};

	$scope.enterEditMainInfo = function() {
		$scope.model.mainInfoEditing = true;
		$scope.scrollToSection(0);
	};

	$scope.leaveMainInfoEditing = function() {
		$scope.model.validateMethods.clearAllFields();
		$scope.model.mainInfoEditing = false;
		$scope.scrollToSection(0);
		setCompanyDataToForm();
	};

	$scope.updateMainInfo = function() {
		if ($scope.model.selectizeLocationObject) {
			if (typeof $scope.model.selectizeLocationObject == 'object') {
				$scope.model.mainInfoForm.city_id = +$scope.model.selectizeLocationObject.id;
			} else {
				$scope.model.mainInfoForm.city_id = +$scope.model.selectizeLocationObject;
			}
		} else {
			$scope.model.mainInfoForm.city = null;
			$scope.model.mainInfoForm.country = null;
			$scope.model.mainInfoForm.city_id = null;
		}

		companiesAPI.update($stateParams.organizationId, $scope.model.mainInfoForm)
			.success(function(response) {
				$scope.model.validateObject = null;
				$scope.model.organization = response;
				$scope.leaveMainInfoEditing();
			})
			.error(function(response) {
				$scope.model.validateObject = response;
			});
	};

	// Admins -------------------------------------------------------------------------- /

	$scope.updateAdmin = function(admin) {
		companiesAPI.updateAdmin($stateParams.organizationId, admin.id, admin.permissions).success(function(permissions) {
			angular.forEach($scope.model.members, function(member, index) {
				if (member.id == admin.id) {
					$scope.model.members[index].permissions = permissions;
				}
			});
		});
	};

	$scope.enterAdminsEditing = function() {
		$scope.model.expertsEditing = false;
		$scope.model.adminsEditing = true;
	};

	$scope.enterExpertsEditing = function() {
		$scope.model.adminsEditing = false;
		$scope.model.expertsEditing = true;
		$scope.model.memberForm.role = 'Expert';
	};

	$scope.leaveMemberEditing = function() {
		$scope.model.memberForm = angular.copy(_INVITE_MEMBER_FORM);
		$scope.model.adminsEditing = false;
		$scope.model.expertsEditing = false;
	};

	$scope.inviteHackPackMember = function(user) {
		companiesAPI.inviteHackPackMember($stateParams.organizationId, user.id)
			.success(function() {
				//$scope.model.sentRequests.push({
				//	profile_id: user.id,
				//	profile: user
				//});

				$scope.leaveMemberEditing();
			})
			.error(function() {
				$scope.leaveMemberEditing();
			});
	};

	$scope.inviteMemberViaEmail = function() {
		if ($scope.model.memberForm.email && $scope.model.memberForm.role) {
			$scope.model.memberForm.organization_id = $stateParams.organizationId;
			$scope.model.memberForm.is_admin = $scope.model.memberForm.role == 'PR';

			companiesAPI.inviteUserViaEmail($stateParams.organizationId, $scope.model.memberForm).success(function() {
				$scope.leaveMemberEditing();
				noty({
					text: $filter('translate')('NOTIFICATIONS.NEW_COMPANY_MEMBER_INVITED.SUCCESS'),
					type: 'success'
				});
			});
		}
	};

	$scope.createNewExpertProfile = function() {
		if ($scope.model.memberForm.first_name && $scope.model.memberForm.last_name) {
			companiesAPI.createExpertPage($stateParams.organizationId, $scope.model.memberForm).success(function(expert) {
				$location.path('/profile/' + expert.id);
				$scope.leaveMemberEditing();
			});
		}
	};

	$scope.confirmRequestFromUser = function(userId, index, isConfirmed) {
		companiesAPI.confirmRequestFromUser($stateParams.organizationId, userId, isConfirmed).success(function() {
			$scope.model.pendingRequests.splice(index, 1);
		});
	};

	$scope.removeMember = function(userId) {
		companiesAPI.removeMember($stateParams.organizationId, userId).success(function() {
			angular.forEach($scope.model.members, function(member, index) {
				if (member.id == userId) {
					$scope.model.members.splice(index, 1);
				}
			});
		});
	};

	// Experts -------------------------------------------------------------------------- /

	$scope.changeExpertAdminStatus = function(expert, isAdmin) {
		companiesAPI.changeExpertAdminStatus($stateParams.organizationId, expert.id, isAdmin).success(function() {
			expert.permissions.is_admin = isAdmin;
		});
	};



	// ================================================================================== /


	var organizationIdToLoad = $stateParams.organizationId || sharedData.get('user.sv.companies[0].id');

	companiesAPI.getById(organizationIdToLoad).success(function(organization) {
		//$location.path('/organization/' + organizationIdToLoad);

		$scope.model.organization = organization;
		$scope.model.members = $scope.model.organization.admins;
		setCompanyDataToForm();
	});

});

