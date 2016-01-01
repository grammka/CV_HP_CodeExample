angular.module('HPApp').controller('RequestDeclineColleagueRequestCtrl', function(
	$rootScope, $state,
	principal, redirect,
	colleaguesAPI
) {

	if (principal.isAuthenticated()) {
		colleaguesAPI.declineRequest($rootScope.initToStateParams.id).success(function() {
			redirect.inside();
		});
	} else {
		$state.go('signIn');
	}

});

