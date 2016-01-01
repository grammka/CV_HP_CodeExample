angular.module('HPApp').directive('snaps', function(
	$templateCache,
	snapFeedAPI
) {
	return {
		restrict: 'E',
		template: $templateCache.get('snaps.html'),
		replace: true,
		scope: true,
		controller: function($scope) {

			$scope.model = {
				snaps: null,
				nextSnapsPageUrl: null
			};



			snapFeedAPI.getList().success(function(response) {
				$scope.model.snaps = response.results;
				$scope.model.nextSnapsPageUrl = response.next;
			});

		}
	};
});
