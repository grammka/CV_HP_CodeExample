angular.module('HPApp').run(function(
	$rootScope, $location,
	localization, principal, rolesCondition, linksParser,
	websocketAPI
) {

	$rootScope.LP               = linksParser;
	$rootScope.RC               = rolesCondition;
	$rootScope.protocol         = $location.protocol();
	$rootScope.host             = location.host;
	$rootScope.apiHostName      = $location.host() == 'hackpack.press' ? 'hackpack.press' : 'justinvarilek.com';
	$rootScope.apiPath          = '//api.' + $rootScope.apiHostName + '/';
	$rootScope.wsPath           = ($rootScope.protocol == 'http' ? 'ws' : 'wss') + ':' + $rootScope.apiPath + 'websocket';


	localization.update();
	websocketAPI.init();



	$rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
		console.info('requested state is [' + toState.name + ']');

		$rootScope.toState = toState;
		$rootScope.toStateParams = toStateParams;

		if (!principal.isRequested()) {
			console.info('request prevented to init Identity');

			$('#preLoader').show();
			event.preventDefault();
			principal.identity();

			return false;
		}
	});

	$rootScope.$on('$stateChangeSuccess', function(event, toState) {
		$rootScope.pathClass = toState.url.replace(/^\/([^\/]+)?.+/, 's-$1');
	});

});
