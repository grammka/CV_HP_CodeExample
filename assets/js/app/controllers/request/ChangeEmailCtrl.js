angular.module('HPApp').controller('RequestChangeEmailCtrl', function(
	$rootScope, $state, $filter,
	principal, redirect,
	authAPI
) {

	if (principal.isAuthenticated()) {
		if ($rootScope.initToState.name == 'request.changeEmail' && $rootScope.initToStateParams.code) {
			authAPI.confirmEmailChanging($rootScope.initToStateParams.code)
				.finally(function() {
					redirect.inside();
				});
		} else {
			redirect.inside();

			noty({
				text: $filter('translate')('NOTIFICATIONS.EMAIL_CHANGE_CODE_NOT_EXIST'),
				type: 'error'
			});
		}
	} else {
		$state.go('signIn');
	}

});


