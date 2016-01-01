angular.module('HPApp').controller('OrganizationCtrl', function(
	$scope, $stateParams,
	organization,
	companiesAPI
) {

	$scope.model = {
		organization: organization
	};

	$scope.model.contentNavigData = {
		organization: organization
	};



	$scope.uploadPhoto = function(files) {
		if (files.length) {
			companiesAPI.uploadPhoto($stateParams.organizationId, files[0]).success(function(response) {
				$scope.model.organization.photo = response.photo;
			});
		}
	};

});

