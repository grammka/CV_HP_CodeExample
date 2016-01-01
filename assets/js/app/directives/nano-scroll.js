angular.module('HPApp').directive('nanoScroll', function($rootScope, $timeout) {
	return {
		restrict: 'A',
		scope: {
			track: '=',
			methods: '=',
			lazyLoader: '&',
			lazyTopLoader: '&'
		},

		link: function($scope, $element, $attrs) {

			var $content = $element.find('>.nano-content');


			$timeout(function() {
				$element.nanoScroller({
					iOSNativeScrolling: true,
					alwaysVisible: true
				});

				$element.on('update', function(event, values) {
					if ($attrs.lazyLoader && values.direction == 'down' && values.position > values.maximum * 55 / 100) {
						$scope.lazyLoader();
					} else if ($attrs.lazyTopLoader && values.direction == 'up' && values.position < values.maximum * 35 / 100) {
						$scope.lazyTopLoader();
					}
				});

				if ($scope.track == false) {
					$element.addClass('nano_wo-track');
				}
			});



			if ($attrs.methods && $scope.methods) {
				$scope.methods.update = function() {
					$element.nanoScroller();
				};

				$scope.methods.scrollTop = function(value) {
					$element.nanoScroller(value ? {scrollTop: value} : {scroll: 'top'});
				};

				$scope.methods.scrollBottom = function(value) {
					$element.nanoScroller(value ? {scrollBottom: value} : {scroll: 'bottom'});
				};

				$scope.methods.getCurrParams = function() {
					return {
						height: $content[0].scrollHeight,
						scrollTop: $content[0].scrollTop,
						scrollBottom: $content[0].scrollHeight - $content[0].scrollTop
					}
				};
			}



			$rootScope.$on('updateNanoScroller', function() {
				$timeout(function() {
					$element.nanoScroller();
				});
			});

		}
	};
});
