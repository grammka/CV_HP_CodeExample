angular.module('HPApp').controller('ProfilePrincipalCtrl', function(
	$rootScope, $scope, $r, $stateParams, $timeout,
	sharedData, staticData, localStorageService,
	user,
	ProfileFactory,
	usersAPI, profileSharesAPI, optionsAPI, colleaguesAPI
) {

	console.info('[ProfilePrincipalCtrl] loaded');

	var _LOCATION_FORM = {
			object: null
		},
		_LANGUAGE_FORM = {
			language: null,
			experience: null
		},
		_LINKS_FORM = {
			name: null,
			url: null
		},
		_GEAR_FORM = {
			category: null,
			description: null
		};

	$scope.model = {
		currUserId: sharedData.get('user.sv.id'),
		currUser: sharedData.get('user.sv'),
		user: user,
		suggestions: null,
		editing: false,

		extraRolesSelectOptions: (function() {
			var roles = [];
			angular.forEach(staticData.get('roles'), function(role) {
				if (!role.is_single) {
					roles.push({value: role.name, label: role.label, is_single: role.is_single});
				}
			});
			return roles;
		})(),

		rolesSelectOptions:                 staticData.getUserRolesOptions(),
		goingLiveSelectOptions:             staticData.getSelectOptions('going_live'),
		mediaTypesSelectOptions:            staticData.getSelectOptions('media_types'),
		languagesSelectOptions:             staticData.getSelectOptions('languages'),
		languageExperienceSelectOptions:    staticData.getSelectOptions('experience'),
		expertiseSelectOptions:             staticData.getSelectOptions('expertise'),
		affiliationsSelectOptions:          staticData.getSelectOptions('affiliations'),
		skillsSelectOptions:                staticData.getSelectOptions('skills'),
		linksSelectOptions: [],

		selectizeLocationObject: null,
		definedLocation: null,

		form: null,
		locationForm: angular.copy(_LOCATION_FORM),
		languageForm: angular.copy(_LANGUAGE_FORM),
		linksForm: angular.copy(_LINKS_FORM),
		gearForm: angular.copy(_GEAR_FORM),
		validateObject: null,
		validateMethods: null
	};

	$scope.model.mainInfoHelpers = {
		dangerLevel: {
			currLevelIndex: 0,
			levels: (function() {
				var i = 0, levels = [];
				while(i < 5) {
					levels.push({
						title: 'PROFILE.MAIN.INFO_LIST.DANGER_LEVEL.LEVELS.' + i + '.TITLE',
						desc: 'PROFILE.MAIN.INFO_LIST.DANGER_LEVEL.LEVELS.' + i + '.DESC'
					});
					i++;
				}
				return levels;
			})()
		}
	};



	function setUserDataToForm() {
		$scope.model.form = angular.copy($scope.model.user);
		$scope.model.form.role = $scope.model.user.role.name;
		$scope.model.mainInfoHelpers.dangerLevel.currLevelIndex = $scope.model.user.danger_level;

		$scope.model.form.extra_roles = $scope.model.user.extra_roles.map(function(role) {
			return role.name;
		});

		angular.forEach($scope.model.user.links, function(url, name) {
			$scope.model.linksSelectOptions.push({
				label: name,
				value: name
			});
		});

		angular.extend($scope.model.affiliationsSelectOptions, staticData.getSelectOptionsByArray($scope.model.form.affiliations));
		angular.extend($scope.model.expertiseSelectOptions, staticData.getSelectOptionsByArray($scope.model.form.expertise));
		angular.extend($scope.model.skillsSelectOptions, staticData.getSelectOptionsByArray($scope.model.form.skills));
	}
	
	

	// Defined Location -------------------------------------------------------------- /

	$scope.updateLocation = function() {
		if ($scope.model.definedLocation.id) {
			usersAPI.update($stateParams.userId, {city_ids: [$scope.model.definedLocation.id]}).success(function(response) {
				$scope.model.user = response;
				$scope.model.definedLocation = null;
				setUserDataToForm();
			});
		}
	};

	$scope.cancelDefinedLocation = function() {
		$scope.model.definedLocation = null;
		localStorageService.set('profile:definedLocationCanceled', true);
	};



	// Main Info ------------------------------------------------------------------- /

	$scope.edit = function() {
		$scope.model.editing = true;
		$rootScope.$emit('updateNanoScroller');
	};

	$scope.cancel = function() {
		$scope.model.editing = false;
		$rootScope.$emit('updateNanoScroller');

		if ($scope.model.validateMethods) {
			$scope.model.validateMethods.clearAllFields();
		}

		setUserDataToForm();
	};

	$scope.save = function() {
		$scope.model.form.about = String($scope.model.form.about).replace(/\&nbsp\;?/g, ' ').replace(/\s+/, ' ').replace(/<[^>]+>/gm, '');
		$scope.model.form.about = stripScripts($scope.model.form.about);

		usersAPI.update($stateParams.userId, $scope.model.form)
			.success(function(response) {
				$scope.model.validateObject = null;
				$scope.model.user = response;
				$scope.cancel();
			})
			.error(function(response) {
				$scope.model.validateObject = response;
			});
	};

	$scope.addLocation = function() {
		if ($scope.model.locationForm.object) {
			$scope.model.form.cities.push($scope.model.locationForm.object);
			$scope.model.form.city_ids.push($scope.model.locationForm.object.id);
			$scope.model.locationForm = angular.copy(_LOCATION_FORM);
		}
	};

	$scope.removeLocation = function(index) {
		$scope.model.form.cities.splice(index, 1);
		$scope.model.form.city_ids.splice(index, 1);
	};

	$scope.addLanguage = function() {
		if ($scope.model.languageForm.language && $scope.model.languageForm.experience) {
			$scope.model.form.languages.push($scope.model.languageForm);
			$scope.model.languageForm = angular.copy(_LANGUAGE_FORM);
		}
	};

	$scope.removeLanguage = function(index) {
		$scope.model.form.languages.splice(index, 1);
	};

	$scope.addGear = function() {
		if ($scope.model.gearForm.description) {
			$scope.model.form.gears.push($scope.model.gearForm);
			$scope.model.gearForm = angular.copy(_GEAR_FORM);
		}
	};

	$scope.removeGear = function(index) {
		$scope.model.form.gears.splice(index, 1);
	};

	$scope.addLink = function() {
		if ($scope.model.linksForm.name && $scope.model.linksForm.url) {
			$scope.model.form.links[$scope.model.linksForm.name] = $scope.model.linksForm.url;
			$scope.model.linksForm = angular.copy(_LINKS_FORM);
		}
	};

	$scope.removeLink = function(name) {
		if (name != $scope.model.currUser.social_auth_used_links) {
			$scope.model.form.links[name] = null;
		}
	};

	$scope.goDangerLevelHelperInfo = function(step, isEditMode) {
		if (
			(step == -1 && $scope.model.mainInfoHelpers.dangerLevel.currLevelIndex != 0)
			|| (step == 1 && $scope.model.mainInfoHelpers.dangerLevel.currLevelIndex != $scope.model.mainInfoHelpers.dangerLevel.levels.length - 1)
		) {
			$scope.model.mainInfoHelpers.dangerLevel.currLevelIndex += step;

			if (isEditMode) {
				$scope.model.form.danger_level = $scope.model.mainInfoHelpers.dangerLevel.currLevelIndex;
			}
		}
	};



	// Suggestions ------------------------------------------------------- /

	$scope.acceptColleagueRequest = function(user) {
		colleaguesAPI.acceptRequest(user.id).success(function() {
			user.is_confirmed = true;
		});
	};

	$scope.declineColleagueRequest = function(user, index) {
		colleaguesAPI.declineRequest(user.id).success(function() {
			$scope.model.colleagues.splice(index, 1);
		});
	};

	$scope.addColleague = function(user, index) {
		colleaguesAPI.sendRequest(user.id).success(function() {
			$scope.model.suggestions.splice(index, 1);
			noty({
				text: $filter('translate')('NOTIFICATIONS.REQUEST_SENT'),
				type: 'success'
			});
		});
	};

	$scope.hideColleague = function() {

	};



	setUserDataToForm();

	if ($scope.model.currUserId == user.id) {
		if (!$scope.model.city_id || !localStorageService.get('profile:definedLocationCanceled')) {
			geolocator.locateByIP(function(response) {
				optionsAPI.geoLocation(response.coords.longitude + ',' + response.coords.latitude).success(function(response) {
					$scope.model.definedLocation = response[0];
				});
			}, function() {
				console.error('Location not defined');
			}, 2);
		}
	}

	$r(ProfileFactory.getPortfolioData(user.id))($scope, 'model.articles');

	if ($scope.model.currUserId == $scope.model.user.id) {
		$r(ProfileFactory.getSuggestionsData())($scope, 'model.suggestions');
	}

});
