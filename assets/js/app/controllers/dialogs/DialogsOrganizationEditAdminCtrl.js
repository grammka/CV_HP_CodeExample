angular.module('HPApp').controller('DialogsOrganizationEditAdminCtrl', function(
	$scope,
	user
) {

	$scope.model = {
		user: user
	};



	$scope.save = function() {
		$scope.closeThisDialog($scope.model.user.permissions);
	};

});
