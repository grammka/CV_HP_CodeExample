angular.module('HPApp').factory('redirect', function(
	$rootScope, $state,
	checkUserParams
) {
	var Redirect = {};


	Redirect.inside = function() {
		if (checkUserParams.isRoleAndEmailExist()) {
			var state       = $rootScope.returnToState || $rootScope.toState,
				stateParams = $rootScope.returnToStateParams || $rootScope.toStateParams || {};

			if (!state.name.indexOf('ws.')) {
				$state.go(state.name, stateParams);
			} else {
				Redirect.toSnaps();
			}
		} else {
			$state.go('configProfile');
		}
	};

	Redirect.toSnaps = function() {
		$state.go('ws.snapFeed.list');
	};

	
	return Redirect;
});
