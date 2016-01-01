angular.module('HPApp').controller('RequestDeclineCompanyRequestCtrl', function(
	$rootScope, $state,
	principal, redirect,
	companiesAPI
) {

	if (principal.isAuthenticated()) {
		companiesAPI.declineCompanyRequest($rootScope.initToStateParams.id).success(function() {
			redirect.inside();
		});
	} else {
		$state.go('signIn');
	}

});

