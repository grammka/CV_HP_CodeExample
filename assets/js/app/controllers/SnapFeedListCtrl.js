angular.module('HPApp').controller('SnapFeedListCtrl', function(
	$scope, $location, $state, $stateParams, $translate,
	snapFeedOptions, localStorageService, ngDialog, sharedData,
	snapFeedAPI
) {

	var _FILTER_FORM = {
		category: 'all',
		city: null,
		country: null,
		snap_type: null,
		tags: null,
		items_per_page: 20
	};

	$scope.model = {
		user: sharedData.get('user.sv'),
		currUserId: sharedData.get('user.sv.id'),
		snaps: null,
		nextSnapsUrl: null,

		selectizeLocationObject: null,
		typesSelectOptions: snapFeedOptions.get('create_categories'),
		tagsSelectOptions: snapFeedOptions.getSelectOptions('tags'),

		filterForm: angular.copy(_FILTER_FORM)
	};



	// Sidebar ---------------------------------------------------------------------- /

	$scope.getSnaps = function() {
		snapFeedAPI.getList($scope.model.filterForm).success(function(response) {
			$scope.model.snaps = response.results;
			$scope.model.nextSnapsUrl = response.next;
		});
	};

	var nextPageIsLoading = false;
	$scope.loadNextSnapsPage = function() {
		if (!nextPageIsLoading && $scope.model.nextSnapsUrl) {
			nextPageIsLoading = true;
			snapFeedAPI.getNextPageList($scope.model.nextSnapsUrl, $scope.model.filterForm)
				.success(function(response) {
					$scope.model.nextSnapsUrl = response.next;
					$scope.model.snaps = $scope.model.snaps.concat(response.results);
				})
				.finally(function() {
					nextPageIsLoading = false;
				});
		}
	};

	$scope.submitSearch = function() {
		$scope.model.filterForm.city = null;
		$scope.model.filterForm.country = null;

		if ($scope.model.selectizeLocationObject) {
			var type = $scope.model.selectizeLocationObject.type;

			type = type == 'city' ? 'cities' : 'countries';

			$scope.model.filterForm[type] = $scope.model.selectizeLocationObject.id;
		}

		$scope.getSnaps();
	};

	$scope.clearFilterForm = function() {
		$scope.model.selectizeLocationObject = null;
		$scope.model.filterForm = angular.copy(_FILTER_FORM);
		$scope.getSnaps();
	};



	// Content ----------------------------------------------------------------------- /

	$scope.hideSnap = function(snapId, index) {
		snapFeedAPI.hideSnap(snapId).success(function() {
			$scope.model.snaps.splice(index, 1);
		});
	};

	$scope.editSnap = function(snapId) {
		$state.go('ws.snapFeed.edit', {snapId: snapId});
	};

	$scope.toggleTag = function(tag) {
		if ($scope.model.filterForm.tags == tag) {
			$scope.model.filterForm.tags = null;
		} else {
			$scope.model.filterForm.tags = tag;
		}

		$scope.submitSearch();
	};

	//$scope.removeTag = function() {
	//	$scope.model.filterForm.tags = null;
	//	$scope.submitSearch();
	//};



	$scope.model.filterForm.category = $stateParams.category && $stateParams.category != 'true' ? $stateParams.category : 'all';
	$scope.getSnaps();

});
