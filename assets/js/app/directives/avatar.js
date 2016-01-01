angular.module('HPApp').directive('avatar', function(avatar) {
	return {
		restrict: 'AE',
		scope: {
			data: '='
		},
		template: '<div class="sq-img avatar" />',
		replace: true,

		link: function($scope, $element) {

			$element.html(avatar($scope.data));

			$scope.$watch('data.photo', function(n, o) {
				if (n != o) {
					$element.html(avatar($scope.data));
				}
			});

		}
	};
});
