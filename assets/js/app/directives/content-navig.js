angular.module('HPApp').directive('contentNavig', function(
	$rootScope, $templateCache,
	sharedData, ContentNavigItems
) {
	return {
		restrict: 'E',
		scope: {
			items: '@',
			data: '=?'
		},
		template: $templateCache.get('content-navig.html'),
		replace: true,

		link: function($scope) {

			$scope.model = {
				user: sharedData.get('user.sv'),
				items: ContentNavigItems.get($scope.items, $scope.data),
				activeItem: null
			};



			$scope.select = function(item) {
				$scope.model.activeItem = item;
				$rootScope.$broadcast('updateNanoScroller');
			};

		}
	};
});
