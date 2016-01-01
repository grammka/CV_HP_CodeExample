angular.module('HPApp').controller('OrganizationUserRequestsCtrl', function(
	$scope, $stateParams, $location,
	organization,
	companiesAPI
) {

	$scope.model = {
		users: null
	};



	$scope.accept = function(userId, index) {
		companiesAPI.acceptUserRequest($stateParams.organizationId, userId).success(function() {
			$scope.model.users.splice(index, 1);
		});
	};

	$scope.decline = function(userId, index) {
		companiesAPI.declineUserRequest($stateParams.organizationId, userId).success(function() {
			$scope.model.users.splice(index, 1);
		});
	};



	companiesAPI.getUsersRequests($stateParams.organizationId).success(function(response) {
		$scope.model.users = response;
	});

});
