angular.module('HPApp').controller('SnapFeedPreviewCtrl', function(
	$scope, $stateParams, $state,
	sharedData,
	snapFeedAPI
) {

	$scope.model = {
		user: sharedData.get('user.sv'),
		snap: null
	};



	$scope.publish = function() {
		snapFeedAPI.publishSnap($stateParams.snapId).success(function() {
			$state.go('ws.snapFeed.list', {category: 'created'});
		});
	};

	$scope.unpublish = function() {
		snapFeedAPI.unpublishSnap($stateParams.snapId).success(function() {
			$state.go('ws.snapFeed.list', {category: 'created'});
		});
	};

	$scope.remove = function() {
		snapFeedAPI.removeSnap($stateParams.snapId).success(function() {
			$state.go('ws.snapFeed.list');
		});
	};



	snapFeedAPI.getSnap($stateParams.snapId).success(function(snap) {
		$scope.model.snap = snap;
	});

});
