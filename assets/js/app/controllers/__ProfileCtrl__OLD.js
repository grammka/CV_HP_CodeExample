angular.module('HPApp').controller('ProfileGGgggCtrl', function(
	$scope, $r, $state, $timeout, $filter, $stateParams, $translate,
	sharedData, staticData, localStorageService, ngDialog,
	ProfileFactory,
	usersAPI, profileSharesAPI, colleaguesAPI, companiesAPI, optionsAPI
) {

	var _GRANT_ACCESS_TO_EXPERT = {
			email: null
		},
		_PRIVACY_SETTINGS_FORM = {
			privacy_level: null,
			pseudonym: null
		},
		_LANGUAGE_FORM = {
			language: null,
			experience: null
		},
		_GEAR_FORM = {
			category: null,
			description: null
		},
		_PORTFOLIO_FORM = {
			id: null,
			title: null,
			created: null,
			link: null,
			publisher: null
		};

	$scope.model = {
		currUserId: sharedData.get('user.sv.id'),
		currUser: sharedData.get('user.sv'),

		user: null,
		articles: null,
		colleagues: null,
		suggestions: null,

		definedLocation: null,
		activeNavigItem: null,

		rolesSelectOptions:                 staticData.getUserRolesOptions(),
		rolesWithFullData: (function() {
			var roles = {};
			angular.forEach(staticData.get('roles'), function(role) {
				roles[role.name] = role;
			});
			return roles;
		})(),
		extraRolesSelectOptions: (function() {
			var roles = [];
			angular.forEach(staticData.get('roles'), function(role) {
				if (!role.is_single) {
					roles.push({value: role.name, label: role.name, is_single: role.is_single});
				}
			});
			return roles;
		})(),

		goingLiveSelectOptions:             staticData.getSelectOptions('going_live'),
		mediaTypesSelectOptions:            staticData.getSelectOptions('media_types'),
		languagesSelectOptions:             staticData.getSelectOptions('languages'),
		languageExperienceSelectOptions:    staticData.getSelectOptions('experience'),
		expertiseSelectOptions:             staticData.getSelectOptions('expertise'),
		affiliationsSelectOptions:          staticData.getSelectOptions('affiliations'),
		skillsSelectOptions:                staticData.getSelectOptions('skills'),

		grantAccessToExpertForm: angular.copy(_GRANT_ACCESS_TO_EXPERT),
		grantAccessToExpertEditing: false,

		privacyLevelOptions: {
			pub: {
				value: 'pub',
				label: 'PROFILE.PRIVACY_SETTINGS.FORM.PRIVACY_LEVEL.SELECT_OPTIONS.PUBLIC.LABEL',
				desc: 'PROFILE.PRIVACY_SETTINGS.FORM.PRIVACY_LEVEL.SELECT_OPTIONS.PUBLIC.DESC'
			},
			sec: {
				value: 'sec',
				label: 'PROFILE.PRIVACY_SETTINGS.FORM.PRIVACY_LEVEL.SELECT_OPTIONS.SECURE.LABEL',
				desc: 'PROFILE.PRIVACY_SETTINGS.FORM.PRIVACY_LEVEL.SELECT_OPTIONS.SECURE.DESC'
			},
			top: {
				value: 'top',
				label: 'PROFILE.PRIVACY_SETTINGS.FORM.PRIVACY_LEVEL.SELECT_OPTIONS.TOP_SECRET.LABEL',
				desc: 'PROFILE.PRIVACY_SETTINGS.FORM.PRIVACY_LEVEL.SELECT_OPTIONS.TOP_SECRET.DESC'
			}
		},
		privateSettingsForm: angular.copy(_PRIVACY_SETTINGS_FORM),
		privateSettingsEditing: false,

		socialAuthUsedLinks: {},

		mainInfoForm: null,
		mainInfoEditing: false,
		selectizeLocationObject: null,
		languageForm: angular.copy(_LANGUAGE_FORM),
		gearForm: angular.copy(_GEAR_FORM),
		validateObject: null,
		validateMethods: null,

		portfolioEditing: false,
		articleForm: angular.copy(_PORTFOLIO_FORM)
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



	// ============================================================================================ /

	function setUserDataToForm() {
		$scope.model.mainInfoForm = angular.copy($scope.model.user);
		$scope.model.mainInfoHelpers.dangerLevel.currLevelIndex = $scope.model.user.danger_level;
		$scope.model.privateSettingsForm.privacy_level = $scope.model.user.privacy_level;
		$scope.model.privateSettingsForm.pseudonym = $scope.model.user.pseudonym;

		angular.extend($scope.model.affiliationsSelectOptions, staticData.getSelectOptionsByArray($scope.model.mainInfoForm.affiliations));
		angular.extend($scope.model.expertiseSelectOptions, staticData.getSelectOptionsByArray($scope.model.mainInfoForm.expertise));
		angular.extend($scope.model.skillsSelectOptions, staticData.getSelectOptionsByArray($scope.model.mainInfoForm.skills));
	}



	$scope.scrollToSection = function(index) {
		if ($scope.model.contentBaron) {
			$scope.model.contentBaron.fixHeaders.scrollTo(index);
		}
	};



	// Sidebar ------------------------------------------------------------------- /

	$scope.uploadAvatar = function(files) {
		if (files.length) {
			usersAPI.uploadPhoto($stateParams.userId, files[0]).success(function(response) {
				$scope.model.user.photo = response.photo;
			});
		}
	};

	$scope.updateAvailableStatus = function(isAvailable) {
		usersAPI.update('me', {is_available: isAvailable}).success(function() {
			$scope.model.user.is_available = isAvailable;
		});
	};

	$scope.requestAsColleague = function() {
		colleaguesAPI.sendRequest($stateParams.userId).success(function() {
			$scope.model.user.colleague_status = 'pending';
			noty({
				text: $filter('translate')('NOTIFICATIONS.REQUEST_SENT'),
				type: 'success'
			});
		});
	};

	$scope.cancelRequestAsColleague = function() {
		colleaguesAPI.cancelRequest($stateParams.userId).success(function() {
			$scope.model.user.colleague_status = null;
			noty({
				text: $filter('translate')('NOTIFICATIONS.REQUEST_CANCELED'),
				type: 'success'
			});
		});
	};

	$scope.acceptColleagueRequest = function(event, user) {
		event.stopPropagation();
		event.preventDefault();
		colleaguesAPI.acceptRequest(user.id).success(function() {
			user.is_confirmed = true;
		});
		return false;
	};

	$scope.declineColleagueRequest = function(event, user, index) {
		event.stopPropagation();
		event.preventDefault();
		colleaguesAPI.declineRequest(user.id).success(function() {
			$scope.model.colleagues.splice(index, 1);
		});
		return false;
	};

	$scope.sharePrivateInfo = function() {
		profileSharesAPI.share($stateParams.userId).success(function() {
			$scope.model.user.is_my_profile_shared = true;
		});
	};

	$scope.stopSharingPrivateInfo = function() {
		profileSharesAPI.stopSharing($stateParams.userId).success(function() {
			$scope.model.user.is_my_profile_shared = false;
		});
	};

	// Grant access to Expert ------------------------------------------------------- /

	$scope.enterGrantAccessToExpert = function() {
		$scope.model.grantAccessToExpertEditing = true;
		$scope.scrollToSection(0);
	};

	$scope.giveAccessToExpertViaEmail = function() {
		if ($scope.model.grantAccessToExpertForm.email) {
			companiesAPI.giveProfileAccessToExpert(
				$scope.model.user.companies[0].id,
				$stateParams.userId,
				$scope.model.grantAccessToExpertForm.email
			)
				.success(function() {
					$scope.leaveInfoEditing();
					noty({
						text: $filter('translate')('NOTIFICATIONS.GRANT_ACCESS_TO_EXPERT_PROFILE.SUCCESS'),
						type: 'success'
					});
				});
		}
	};

	// Private settings ------------------------------------------------------------- /

	$scope.enterEditPrivateSettings = function() {
		$scope.model.privateSettingsEditing = true;
		$scope.scrollToSection(0);
	};

	$scope.updatePrivateSettings = function() {
		usersAPI.update($stateParams.userId, $scope.model.privateSettingsForm)
			.success(function(response) {
				$scope.model.user = response;
				$scope.leaveInfoEditing();
			});
	};

	// Defined Location -------------------------------------------------------------- /

	$scope.updateLocation = function() {
		if ($scope.model.definedLocation.id) {
			usersAPI.update($stateParams.userId, {city_id: $scope.model.definedLocation.id}).success(function(response) {
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

	$scope.enterEditMainInfo = function() {
		$scope.model.mainInfoEditing = true;
		$scope.scrollToSection(0);
	};

	$scope.leaveInfoEditing = function() {
		if ($scope.model.validateMethods) {
			$scope.model.validateMethods.clearAllFields();
		}
		$scope.model.grantAccessToExpertEditing = false;
		$scope.model.mainInfoEditing = false;
		$scope.model.privateSettingsEditing = false;
		$scope.scrollToSection(0);
		setUserDataToForm();
	};

	$scope.updateMainInfo = function() {
		if ($scope.model.selectizeLocationObject) {
			if (typeof $scope.model.selectizeLocationObject == 'object') {
				$scope.model.mainInfoForm.city_id = +$scope.model.selectizeLocationObject.id;
			} else {
				$scope.model.mainInfoForm.city_id = +$scope.model.selectizeLocationObject;
			}
		} else {
			$scope.model.mainInfoForm.city = null;
			$scope.model.mainInfoForm.country = null;
			$scope.model.mainInfoForm.city_id = null;
		}

		if (!$scope.model.rolesWithFullData[$scope.model.mainInfoForm.role]) {
			$scope.model.mainInfoForm.role = null;
			$scope.model.mainInfoForm.extra_roles = [];
		} else if ($scope.model.rolesWithFullData[$scope.model.mainInfoForm.role].is_single) {
			$scope.model.mainInfoForm.extra_roles = [];
		}

		$scope.model.mainInfoForm.about = String($scope.model.mainInfoForm.about).replace(/\&nbsp\;?/g, ' ').replace(/\s+/, ' ').replace(/<[^>]+>/gm, '');
		$scope.model.mainInfoForm.about = stripScripts($scope.model.mainInfoForm.about);

		usersAPI.update($stateParams.userId, $scope.model.mainInfoForm)
			.success(function(response) {
				$scope.model.validateObject = null;
				$scope.model.user = response;
				$scope.leaveInfoEditing();
			})
			.error(function(response) {
				$scope.model.validateObject = response;
			});
	};

	$scope.addLanguage = function() {
		if ($scope.model.languageForm.language && $scope.model.languageForm.experience) {
			$scope.model.mainInfoForm.languages.push($scope.model.languageForm);
			$scope.model.languageForm = angular.copy(_LANGUAGE_FORM);
		}
	};

	$scope.removeLanguage = function(index) {
		$scope.model.mainInfoForm.languages.splice(index, 1);
	};

	$scope.addGear = function() {
		if ($scope.model.gearForm.description) {
			$scope.model.mainInfoForm.gears.push($scope.model.gearForm);
			$scope.model.gearForm = angular.copy(_GEAR_FORM);
		}
	};

	$scope.removeGear = function(index) {
		$scope.model.mainInfoForm.gears.splice(index, 1);
	};

	// Main info / HELPERS --------------------------------------------------------------------- /

	$scope.goDangerLevelHelperInfo = function(step, isEditMode) {
		if (
			(step == -1 && $scope.model.mainInfoHelpers.dangerLevel.currLevelIndex != 0)
			|| (step == 1 && $scope.model.mainInfoHelpers.dangerLevel.currLevelIndex != $scope.model.mainInfoHelpers.dangerLevel.levels.length - 1)
		) {
			$scope.model.mainInfoHelpers.dangerLevel.currLevelIndex += step;

			if (isEditMode) {
				$scope.model.mainInfoForm.danger_level = $scope.model.mainInfoHelpers.dangerLevel.currLevelIndex;
			}
		}
	};

	// Articles -------------------------------------------------------------------- /

	$scope.enterEditArticle = function() {
		$scope.model.portfolioEditing = true;
	};

	$scope.openEditArticleForm = function(article, index) {
		angular.extend($scope.model.articleForm, article);

		$scope.model.editingArticleIndex = index;
		$scope.enterEditArticle();
		$scope.scrollToSection(1);
	};

	$scope.cancelEditingArticle = function() {
		$scope.model.portfolioEditing = false;
		$scope.model.articleForm = angular.copy(_PORTFOLIO_FORM);
	};

	$scope.saveArticle = function() {
		if ($scope.model.articleForm.id) {
			usersAPI.updateArticle($stateParams.userId, $scope.model.articleForm.id, $scope.model.articleForm).success(function(article) {
				$scope.model.articles[$scope.model.editingArticleIndex] = article;
				$scope.cancelEditingArticle();
			});
		} else {
			usersAPI.createArticle($stateParams.userId, $scope.model.articleForm).success(function(article) {
				$scope.model.articles.push(article);
				$scope.cancelEditingArticle();
			});
		}
	};

	$scope.upArticle = function(article, index) {
		$scope.model.articles[index] = $scope.model.articles[index - 1];
		$scope.model.articles[index - 1] = article;
	};

	$scope.downArticle = function(article, index) {
		if ($scope.model.articles[index + 1].is_favorite) {
			$scope.model.articles[index] = $scope.model.articles[index + 1];
			$scope.model.articles[index + 1] = article;
			$scope.downArticle(article, ++index);
		}
	};

	$scope.toggleArticleFavorite = function(article, index) {
		usersAPI.updateArticle($stateParams.userId, article.id, {is_favorite: !article.is_favorite}).success(function(_article) {
			article.is_favorite = _article.is_favorite;

			if (article.is_favorite) {
				while(index > 0) {
					$scope.upArticle(article, index--);
				}
			} else {
				$scope.downArticle(article, index);
			}
		});
	};

	$scope.removeArticle = function(articleId, index) {
		usersAPI.removeArticle($stateParams.userId, articleId).success(function() {
			$scope.model.articles.splice(index, 1);
		});
	};



	// ========================================================================================= /


	function getDefinedLocation() {
		if (!$scope.model.city_id || !localStorageService.get('profile:definedLocationCanceled')) {
			geolocator.locateByIP(function(response) {
				optionsAPI.geoLocation(response.coords.longitude + ',' + response.coords.latitude).success(function(response) {
					$scope.model.definedLocation = response[0];
					$timeout(function() {
						$scope.scrollToSection(0);
					});
				});
			}, function() {
				console.log('Error: Location isn\'t defined');
			}, 2);
		}
	}

	function getAdditionalData() {
		setUserDataToForm();

		if ($scope.model.currUserId == $scope.model.user.id) {
			getDefinedLocation();
		}

		$r(ProfileFactory.getPortfolioData($scope.model.user.id))($scope, 'model.articles');
		$r(ProfileFactory.getColleaguesData($scope.model.user.id))($scope, 'model.colleagues');

		if ($scope.model.currUserId == $scope.model.user.id) {
			$r(ProfileFactory.getSuggestionsData())($scope, 'model.suggestions');
		}
	}

	(function requestData(userId) {
		if ($scope.model.currUserId == userId) {
			$scope.model.user = sharedData.get('user.sv');
			getAdditionalData();
		} else {
			$r(ProfileFactory.getUserData(userId))($scope, 'model.user').then(function () {
				getAdditionalData();
			}, function () {
				$state.go('ws.profile', {userId: $scope.model.currUserId}, {notify: false});
				requestData($scope.model.currUserId);
			});
		}
	})($stateParams.userId || $scope.model.currUserId);




	//if ($translate.use() == 'enUS' && !localStorageService.get('dialog:firstTimeOnProfile')) {
	//	ngDialog.open({
	//		className: 'ngdialog-theme-default ngdialog_first-time-tour',
	//		templateUrl: 'dialogs/first-time-profile.html'
	//	});
	//
	//	localStorageService.set('dialog:firstTimeOnProfile', true);
	//}

});
