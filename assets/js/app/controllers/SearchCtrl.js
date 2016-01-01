angular.module('HPApp').controller('SearchCtrl', function(
	$scope, $translate,
	localStorageService, ngDialog, staticData, sharedData,
	usersAPI
) {

	var _SEARCH_FORM = {
		search: null,
		roles: null,
		languages: null,
		cities: null,
		country: null,
		expertise: null,
		skills: null,
		is_available: null,
		has_car: null
	};

	$scope.model = {
		user: sharedData.get('user.sv'),
		users: null,
		foundCount: 0,
		nextUsersUrl: null,

		selectizeLocationObject: null,
		roles: staticData.getUserRolesOptions(),
		languages: staticData.getSelectOptions('languages'),
		expertise: staticData.getSelectOptions('expertise'),
		skills: staticData.getSelectOptions('skills'),
		isAvailableOptions: [{label: 'Open to gigs', value: true}, {label: 'Booked', value: false}],
		carOptions: [{label: 'Yes', value: true}, {label: 'No', value: false}],

		form: angular.copy(_SEARCH_FORM)
	};



	$scope.getUsers = function(params) {
		params = params || $scope.model.form || {};

		params.items_per_page = 40;

		usersAPI.getList(params).success(function(response) {
			$scope.model.foundCount = response.count;
			$scope.model.nextUsersUrl = response.next;
			$scope.model.users = null;
			$scope.model.users = response.results;
		});
	};

	var nextPageIsLoading = false;
	$scope.loadNextUsersPage = function() {
		if (!nextPageIsLoading && $scope.model.nextUsersUrl) {
			nextPageIsLoading = true;
			usersAPI.getNextPageList($scope.model.nextUsersUrl)
				.success(function(response) {
					$scope.model.nextUsersUrl = response.next;
					$scope.model.users = $scope.model.users.concat(response.results);
				})
				.finally(function() {
					nextPageIsLoading = false;
				});
		}
	};

	$scope.submitSearch = function() {
		$scope.model.form.cities = null;
		$scope.model.form.country = null;

		if ($scope.model.selectizeLocationObject) {
			var type = $scope.model.selectizeLocationObject.type;

			type = type == 'city' ? 'cities' : 'countries';

			$scope.model.form[type] = $scope.model.selectizeLocationObject.id;
		}

		$scope.getUsers();
	};

	$scope.clearSearchForm = function() {
		$scope.model.selectizeLocationObject = null;
		$scope.model.form = angular.copy(_SEARCH_FORM);
		$scope.getUsers();
	};



	$scope.getUsers();

});
