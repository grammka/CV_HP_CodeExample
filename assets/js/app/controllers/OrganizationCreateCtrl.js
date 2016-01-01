angular.module('HPApp').controller('OrganizationCreateCtrl', function(
	$rootScope, $scope, $timeout, $state,
	regExp, sharedData,
	companiesAPI
) {

	var _FORM = {
		name: null,
		website: null
	};

	$scope.model = {
		company: null,
		form: angular.copy(_FORM),
		searchCompanyExist: null,
		requestSent: false,
		invites: null
	};

	$scope.regExp = regExp;



	$scope.onSelectCompany = function(selectedItem) {
		$scope.model.form = selectedItem;
		$scope.model.searchCompanyExist = true;
	};

	$scope.onEmptySearch = function(selectedItem) {
		$scope.model.form = selectedItem;
		$scope.model.searchCompanyExist = false;
	};

	$scope.confirmSelectedCompany = function() {
		companiesAPI.requestToBeAMember($scope.model.company.id).success(function() {
			$scope.model.requestSent = true;
		});
	};

	$scope.declineSelectedCompany = function() {
		$scope.model.company = null;
		$scope.model.form = angular.copy(_FORM);
		$scope.model.searchCompanyExist = null;
	};

	$scope.create = function() {
		companiesAPI.create($scope.model.form).success(function(response) {
			$state.go('ws.organization.principal', {organizationId: response.id}, {reload: true});
		});
	};


	$scope.acceptCompanyRequest = function(event, companyId) {
		event.preventDefault();
		companiesAPI.acceptCompanyRequest(companyId).success(function() {
			$state.go('ws.organization.principal', {organizationId: companyId}, {reload: true});
		});
	};

	$scope.declineCompanyRequest = function(event, companyId, index) {
		event.preventDefault();
		companiesAPI.declineCompanyRequest(companyId).success(function() {
			$scope.model.invites.splice(index, 1);
		});
	};



	companiesAPI.getCompaniesRequest().success(function(response) {
		$scope.model.invites = response;
	});

	$rootScope.$broadcast('clearCompanyInvites');

});
