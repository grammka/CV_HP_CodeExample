angular.module('HPApp').controller('SnapFeedEditCtrl', function(
	$scope, $location, $state, $stateParams, $filter,
	methods, snapFeedOptions, staticData, sharedData, linksParser, ngDialog,
	utilsAPI, snapFeedAPI, optionsAPI
) {

	var _LOCATION_FORM = {
			object: null
		},
		_SNAP_FORM = {
			id: null,
			category: null,
			title: null,
			teaser: null,
			description: null,
			deadline: null,
			date_to_publish: null,
			event_start: null,
			event_finish: null,
			languages: null,
			countries: [],
			country_ids: [],
			affiliation: null,
			tags: [],
			for_roles: [],
			reward_range: null,
			reward_value: null,
			reward_currency: null,
			reward_for: null
		};

	var userCompanies       = sharedData.get('user.sv.companies'),
		userAffiliations    = sharedData.get('user.sv.affiliations');



	$scope.model = {
		user: sharedData.get('user.sv'),
		currSnapId: $stateParams.snapId,

		categoriesSelectOptions:        snapFeedOptions.getCreateCategoriesSelectOptions(),
		tagsMultipleSelectOptions:      snapFeedOptions.getSelectOptions('tags'),
		affiliationsSelectOptions:      null, //staticData.getSelectOptions('affiliations'),
		languagesSelectOptions:         staticData.getSelectOptions('languages'),
		countriesSelectOptions:         null,
		forRolesMultipleSelectOptions:  staticData.getUserRolesOptions(),
		rewardRangeSelectOptions:       snapFeedOptions.getSelectOptions('reward_range'),
		rewardCurrencySelectOptions:    snapFeedOptions.getRewardCurrenciesSelectOptions(),
		rewardForSelectOptions:         snapFeedOptions.getSelectOptions('reward_for'),

		selectedCategory: null,
		attachments: [],
		uploadedAttachments: [],
		photosUploadingProcess: false,

		form: null,
		locationForm: angular.copy(_LOCATION_FORM),
		validateObject: null,
		validateMethods: null
	};



	function extendForm() {
		$scope.model.form = angular.copy(_SNAP_FORM);
		$scope.model.form.reward_range = $scope.model.rewardRangeSelectOptions[0].value;
		$scope.model.form.reward_currency = $scope.model.rewardCurrencySelectOptions[0].value;
		$scope.model.form.reward_for = $scope.model.rewardForSelectOptions[0].value;
	}



	$scope.onCategoryChanged = function() {
		$scope.model.form.category = $scope.model.selectedCategory.value;
	};

	$scope.removePhoto = function(photoId, index) {
		snapFeedAPI.removePhoto(photoId).success(function() {
			$scope.model.uploadedAttachments.splice(index, 1);
		});
	};

	function uploadPhotosToPost(snap) {
		$scope.model.photosUploadingProcess = true;

		var uploadedPhotosCnt = 0;
		angular.forEach($scope.model.attachments, function(photo) {
			snapFeedAPI.uploadPhoto(snap.id, photo).success(function() {
				if (++uploadedPhotosCnt == $scope.model.attachments.length) {
					$scope.model.photosUploadingProcess = false;
					$state.go('ws.snapFeed.preview', {snapId: snap.id});
				}
			});
		});
	}

	function finishCreating(snap) {
		if ($scope.model.attachments && $scope.model.attachments.length) {
			uploadPhotosToPost(snap);
		} else {
			$state.go('ws.snapFeed.preview', {snapId: snap.id});
		}

		if (!$scope.model.user.is_confirmed) {
			ngDialog.open({
				className: 'ngdialog-theme-default',
				template: '\
					<div class="dialog-modal t-max-w400"> \
						<div class="modal-body t-text_center fs_16">\
							' + $filter('translate')('NOTIFICATIONS.SNAP_MODERATION_DESC') + '\
						</div>\
						<div class="vp_10"></div>\
						<div class="btns t-text_center">\
							<div class="btn btn_36 btn_green t-w100" ng-click="closeThisDialog()">\
								' + $filter('translate')('COMMON.OK_BUTTON') + '\
							</div>\
						</div>\
					</div>\
                ',
				disableAnimation: true,
				plain: true,
				appendTo: 'body'
			});
		}
	}

	var submitProcess = false;
	$scope.submit = function() {
		if (!submitProcess) {
			submitProcess = true;
			
			var form = angular.copy($scope.model.form);

			if (form.teaser) {
				form.teaser = linksParser(form.teaser);
			}

			if (form.description) {
				form.description = linksParser(form.description);
			}

			if ($stateParams.snapId) {
				snapFeedAPI.updateSnap($stateParams.snapId, form)
					.success(finishCreating)
					.error(function(response) {
						$scope.model.validateObject = response;
					})
					.finally(function() {
						submitProcess = false;
					});
			} else {
				snapFeedAPI.createSnap(form)
					.success(finishCreating)
					.error(function(response) {
						$scope.model.validateObject = response;
					})
					.finally(function() {
						submitProcess = false;
					});
			}
		}
	};

	$scope.clearForm = function() {
		$scope.model.form.category = $scope.model.selectedCategory.value;
	};



	if (userCompanies && userCompanies.length) {
		$scope.model.affiliationsSelectOptions = [{value: userCompanies[0].name, label: userCompanies[0].name}];
	} else if (userAffiliations && userAffiliations.length) {
		$scope.model.affiliationsSelectOptions = userAffiliations.map(function(affiliation) {
			return {value: affiliation.name, label: affiliation.name};
		});
	} else {
		$scope.model.affiliationsSelectOptions = staticData.getSelectOptions('affiliations');
	}



	if ($stateParams.snapId) {
		snapFeedAPI.getSnap($stateParams.snapId).success(function(snap) {
			extendForm();
			angular.extend($scope.model.form, snap);

			angular.forEach($scope.model.categoriesSelectOptions, function(option, index) {
				if (option.label == snap.category) {
					$scope.model.selectedCategory = $scope.model.categoriesSelectOptions[index];
					$scope.model.form.category = $scope.model.selectedCategory.value;
				}
			});

			$scope.model.uploadedAttachments = snap.attachments || [];
		});
	} else {
		$scope.model.selectedCategory = $scope.model.categoriesSelectOptions[0];
		extendForm();
		$scope.model.form.category = $scope.model.selectedCategory.value;
	}

	optionsAPI.getCountriesLocations().success(function(countries) {
		angular.forEach(countries, function(item, index) {
			countries[index] = {
				label: item.name,
				value: item.id
			};
		});

		$scope.model.countriesSelectOptions = countries;
	});

});
