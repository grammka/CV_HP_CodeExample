angular.module('HPApp').controller('OrganizationPrincipalCtrl', function(
	$scope, $stateParams, $state,
	staticData, sharedData,
	organization,
	companiesAPI
) {

	var _LINKS_FORM = {
		name: null,
		url: null
	};

	$scope.model = {
		currUserId: sharedData.get('user.sv.id'),
		organization: organization,
		editing: false,

		expertiseSelectOptions: staticData.getSelectOptions('expertise'),
		linksSelectOptions: [],

		form: null,
		linksForm: angular.copy(_LINKS_FORM)
	};



	function setCompanyDataToForm() {
		$scope.model.form = angular.copy($scope.model.organization);

		angular.forEach($scope.model.organization.links, function(url, name) {
			if (name != 'Website') {
				$scope.model.linksSelectOptions.push({
					label: name,
					value: name
				});
			}
		});

		angular.extend($scope.model.expertiseSelectOptions, staticData.getSelectOptionsByArray($scope.model.form.expertise));
	}



	// Main Info ------------------------------------------------------------------- /

	$scope.edit = function() {
		$scope.model.editing = true;
	};

	$scope.cancel = function() {
		$scope.model.editing = false;

		if ($scope.model.validateMethods) {
			$scope.model.validateMethods.clearAllFields();
		}

		setCompanyDataToForm();
	};

	$scope.save = function() {
		if ($scope.model.selectizeLocationObject) {
			if (typeof $scope.model.selectizeLocationObject == 'object') {
				$scope.model.form.city_id = +$scope.model.selectizeLocationObject.id;
			} else {
				$scope.model.form.city_id = +$scope.model.selectizeLocationObject;
			}
		} else {
			$scope.model.form.city = null;
			$scope.model.form.country = null;
			$scope.model.form.city_id = null;
		}

		companiesAPI.update($stateParams.organizationId, $scope.model.form)
			.success(function(response) {
				$scope.model.validateObject = null;
				$scope.model.organization = response;
				$scope.cancel();

				$state.reload();
			})
			.error(function(response) {
				$scope.model.validateObject = response;
			});
	};

	$scope.addLink = function() {
		if ($scope.model.linksForm.name && $scope.model.linksForm.url) {
			$scope.model.form.links[$scope.model.linksForm.name] = $scope.model.linksForm.url;
			$scope.model.linksForm = angular.copy(_LINKS_FORM);
		}
	};

	$scope.removeLink = function(name) {
		if (name != 'Website') {
			$scope.model.form.links[name] = null;
		}
	};
	


	setCompanyDataToForm();

});
