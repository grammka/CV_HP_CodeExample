angular.module('HPApp').directive('justNumber', function() {
	return {
		restrict: 'A',
		link: function($scope, $element) {

			$scope.$watch(function() {
				return $element.val();
			}, function(newVal) {
				if (newVal && !/^\d+$/.test(newVal)) {
					newVal = $element.val().replace(/[^\d]/g, '');

					$element.val(newVal);
					$element.trigger('input');
				}
			});

		}
	};
});
