angular.module('HPApp').controller('SignInCtrl', function(
	$rootScope, $scope, $timeout, $stateParams,
	redirect,
	authAPI
) {

	$scope.model = {
		activeSection: $stateParams.section || 'signin',
		inviteCode: $rootScope.toState.name == 'request.byInvitation' && $rootScope.toStateParams.code,
		changePasswordCode: $rootScope.returnToState && $rootScope.returnToState.name == 'request.changePassword' && $rootScope.returnToStateParams.code,
		form: {
			name: null,
			email: null,
			password: null,
			new_password: null
		}
	};



	$scope.toggleSection = function(section) {
		$scope.model.activeSection = section;
		$timeout(function() {
			$('.login input:visible').eq(0).focus();
		});
	};

	$scope.signWithSocial = function(provider) {
		OAuth.redirect(provider, 'http://' + $rootScope.host + '/sign-with-social/' + provider);
	};

	$scope.submitSignInForm = function() {
		if ($scope.model.activeSection == 'signup') {
			var params = {
				name: $scope.model.form.name,
				email: $scope.model.form.email,
				password: $scope.model.form.password
			};

			if ($scope.model.inviteCode) {
				params.code = $scope.model.inviteCode;
			}

			authAPI.signUp(params)
				.success(function() {
					redirect.inside();
				});
		} else if ($scope.model.changePasswordCode) {
			authAPI.signInWithNewPassword({
				code: $scope.model.changePasswordCode,
				email: $scope.model.form.email,
				new_password: $scope.model.form.new_password
			})
				.success(function(response) {
					redirect.inside();
				});
		} else {
			authAPI.signIn({
				email: $scope.model.form.email,
				password: $scope.model.form.password
			})
				.success(function(response) {
					redirect.inside();
				});
		}
	};



	$scope.submitEmailResetForm = function() {
		authAPI.resetPassword($scope.model.form.email).success(function(response) {
			$scope.toggleSection('passresetsuccess');
		});
	};

});
