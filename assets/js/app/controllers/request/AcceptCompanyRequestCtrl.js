angular.module('HPApp').controller('RequestAcceptCompanyRequestCtrl', function(
	$rootScope, $state,
	principal, redirect,
	companiesAPI
) {

	if (principal.isAuthenticated()) {
		companiesAPI.acceptCompanyRequest($rootScope.initToStateParams.id).success(function() {
			redirect.inside();
		});
	} else {
		$state.go('signIn');
	}

});

