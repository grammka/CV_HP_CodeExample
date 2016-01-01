angular.module('HPApp').directive('opengraph', function($templateCache, $timeout) {
	return {
		restrict: 'E',
		scope: {
			data: '=',
			onRemove: '&'
		},
		template: $templateCache.get('opengraph.html'),
		replace: true,

		link: function($scope, $element, $attrs) {

			$scope.removeExist = false;



			$scope.remove = function() {
				$element.remove();
				$scope.onRemove();
			};



			if ($attrs.onRemove) {
				$scope.removeExist = true;
			}

			if ($scope.data.image) {
				var img = new Image();
				img.onerror = function() {
					$element.removeClass('with-image');
				};
				img.src = $scope.data.image;
			}

		}
	};
});
