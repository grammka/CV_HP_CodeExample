angular.module('HPApp').controller('OrganizationSentRequestsCtrl', function(
	$scope, $stateParams, $location,
	organization,
	companiesAPI
) {

	$scope.model = {
		users: null
	};



	companiesAPI.getSentRequests($stateParams.organizationId).success(function(response) {
		$scope.model.users = response;
	});

});
