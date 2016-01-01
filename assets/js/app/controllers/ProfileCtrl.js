angular.module('HPApp').controller('ProfileCtrl', function(
	$scope, $stateParams, $filter,
    user, sharedData,
	usersAPI, colleaguesAPI, profileSharesAPI,
	companiesAPI
) {

	console.info('[ProfileCtrl] loaded');

	$scope.model = {
		user: user,
		currUserId: sharedData.get('user.sv.id'),
		currUser: sharedData.get('user.sv')
	};

	$scope.model.contentNavigData = {
		user: user,
		currUser: $scope.model.currUser
	};



	$scope.giveAccessToExpertViaEmail = function() {
		if ($scope.model.grantAccessToExpertForm.email) {
			companiesAPI.giveProfileAccessToExpert(
				$scope.model.user.companies[0].id,
				$stateParams.userId,
				$scope.model.grantAccessToExpertForm.email
			)
				.success(function() {
					$scope.leaveInfoEditing();
					noty({
						text: $filter('translate')('NOTIFICATIONS.GRANT_ACCESS_TO_EXPERT_PROFILE.SUCCESS'),
						type: 'success'
					});
				});
		}
	};

	$scope.uploadAvatar = function(files) {
		if (files.length) {
			usersAPI.uploadPhoto($stateParams.userId, files[0]).success(function(response) {
				$scope.model.user.photo = response.photo;
			});
		}
	};

	$scope.updateAvailableStatus = function(isAvailable) {
		usersAPI.update('me', {is_available: isAvailable}).success(function() {
			$scope.model.user.is_available = isAvailable;
		});
	};

	$scope.requestAsColleague = function() {
		colleaguesAPI.sendRequest($stateParams.userId).success(function() {
			$scope.model.user.colleague_status = 'pending';
			noty({
				text: $filter('translate')('NOTIFICATIONS.REQUEST_SENT'),
				type: 'success'
			});
		});
	};

	$scope.cancelRequestAsColleague = function() {
		colleaguesAPI.cancelRequest($stateParams.userId).success(function() {
			$scope.model.user.colleague_status = null;
			noty({
				text: $filter('translate')('NOTIFICATIONS.REQUEST_CANCELED'),
				type: 'success'
			});
		});
	};

	$scope.sharePrivateInfo = function() {
		profileSharesAPI.share($stateParams.userId).success(function() {
			$scope.model.user.is_my_profile_shared = true;
		});
	};

	$scope.stopSharingPrivateInfo = function() {
		profileSharesAPI.stopSharing($stateParams.userId).success(function() {
			$scope.model.user.is_my_profile_shared = false;
		});
	};

});
