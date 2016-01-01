angular.module('signPopup', []);

angular.module('signPopup')

	.factory('signPopupModel', function() {
		return {
			isVisible: false
		};
	})

	.directive('signPopup', function(
		$rootScope, $templateCache,
		signPopupModel
	) {
		return {
			restrict: 'E',
			template: $templateCache.get('sign-popup.html'),
			replace: true,
			controller: function($scope) {

				$scope.model = signPopupModel;

				$scope.signWithSocial = function(provider) {
					OAuth.redirect(provider, 'http://' + $rootScope.host + '/sign-with-social/' + provider);
				};

			}
		};
	})

	.directive('openSignPopup', function($timeout, signPopupModel) {
		return {
			restrict: 'A',
			controller: function($scope) {

				$scope.model = signPopupModel;

			},
			link: function($scope, $element) {

				$element.on('click', function() {
					$timeout(function() {
						$scope.model.isVisible = true;
					});
				});

			}
		};
	});
