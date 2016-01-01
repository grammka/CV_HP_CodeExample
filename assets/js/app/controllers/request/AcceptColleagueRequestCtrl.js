angular.module('HPApp').controller('RequestAcceptColleagueRequestCtrl', function(
	$rootScope, $state,
	principal, redirect,
	colleaguesAPI
) {

	if (principal.isAuthenticated()) {
		colleaguesAPI.acceptRequest($rootScope.initToStateParams.id).success(function() {
			redirect.inside();
		});
	} else {
		$state.go('signIn');
	}

});

