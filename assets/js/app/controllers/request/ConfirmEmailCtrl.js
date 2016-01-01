angular.module('HPApp').controller('RequestConfirmEmailCtrl', function(
	$rootScope, $state,
	principal, redirect, checkUserParams,
    authAPI
) {

	if (principal.isAuthenticated()) {
		if (checkUserParams.isEmailConfirmed()) {
			redirect.inside();
		} else {
			if ($rootScope.initToState.name == 'request.confirmEmail' && $rootScope.initToStateParams.code) {
				authAPI.confirmEmail($rootScope.initToStateParams.code)
					.success(function() {
						redirect.inside();
					})
					.error(function() {
						$state.go('emailConfirmation');
					});
			} else {
				$state.go('emailConfirmation');
			}
		}
	} else {
		$state.go('signIn');
	}

});

