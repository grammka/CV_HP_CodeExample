angular.module('HPApp').factory('principal', function(
	$rootScope, $q, $state,
	rolesCondition, redirect,
	authAPI
) {

	var _requesting     = false,
		_requested      = false,
		_authenticated  = false;

	return {
		isRequesting: function() {
			return _requesting;
		},

		isRequested: function() {
			return _requested;
		},

		isAuthenticated: function() {
			return _authenticated;
		},

		authenticate: function(identity) {
			_authenticated = identity != null;
		},

		redirect: function() {
			if (_authenticated) {
				if (
					!$rootScope.toState.name.indexOf('ws.') ||
					['landing', 'registration', 'signIn', 'configProfile'].indexOf($rootScope.toState.name) >= 0
				) {
					redirect.inside();
				} else {
					$state.go($rootScope.toState.name, $rootScope.toStateParams || {});
				}
			} else {
				if (
					$rootScope.toState.name.indexOf('request.') != 0 &&
					($rootScope.toState.name.indexOf('ws.') == 0 || $rootScope.toState.name == 'configProfile')
				) {
					$state.go('signIn');
				} else {
					$state.go($rootScope.toState.name, $rootScope.toStateParams || {});
				}
			}
		},

		identity: function() {
			var self = this;

			_requesting = true;
			_requested = true;

			// used in ConfirmEmail
			$rootScope.initToState = $rootScope.toState;
			$rootScope.initToStateParams = $rootScope.toStateParams;

			return authAPI.getCurrent()
				.success(function(userData) {
					console.info('authorize finished: user Data received');

					self.authenticate(userData);
				})
				.error(function() {
					$rootScope.returnToState = $rootScope.toState;
					$rootScope.returnToStateParams = $rootScope.toStateParams;

					console.info('authorize finished: user didn\'t authorized');

					self.authenticate(null);
				})
				.finally(function() {
					_requesting = false;

					self.redirect();

					setTimeout(function() {
						$('#preLoader').hide();
					}, 1000);
				});
		}
	};
});
