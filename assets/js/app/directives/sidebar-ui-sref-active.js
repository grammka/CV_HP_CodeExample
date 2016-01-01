angular.module('HPApp').directive('sidebarUiSrefActive', function($state) {
	return {
		restrict: 'A',
		link: function($scope, $element, $attrs) {

			var state, stateName, stateParams, activeClass = 'active';

			state = $attrs.sidebarUiSrefActive;
			state = state.match(/^([^\(]+)(?:.*\{)?([^\:\s]+)?(?:[\s\:]+)?([^\:\s\}]+)?/);

			stateName = state[1];

			if (state[2] && state[3]) {
				stateParams = {};
				stateParams[state[2]] = state[3];
			}


			function match() {
				if (stateName == 'ws.profile.principal') {
					return $state.includes('ws.profile', stateParams);
				} else if (stateName == 'ws.organization.principal') {
					return $state.includes('ws.organization', stateParams);
				} else if (stateName == 'ws.snapFeed.list') {
					return $state.includes('ws.snapFeed');
				} else {
					return $state.includes(stateName);
				}
			}

			function toggleClass() {
				if (match()) {
					$element.addClass(activeClass);
				} else {
					$element.removeClass(activeClass);
				}
			}


			toggleClass();

			$scope.$on('$stateChangeSuccess', toggleClass);

		}
	};
});
