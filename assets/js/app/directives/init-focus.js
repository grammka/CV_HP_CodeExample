angular.module('HPApp').directive('initFocus', function() {
	return {
		link: function($scope, $element, $attrs) {

			$scope.$watch($attrs.initFocus, function() {
				$element[0].focus();
				$scope[$attrs.focusMe] = false;
			});

		}
	};
});
