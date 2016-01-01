angular.module('HPApp').directive('rating', function() {
	return {
		restrict: 'E',
		scope: {
			rating: '=',
			max: '='
		},
		template: '\
			<div class="rating">\
				<span class="rating__item" \
					ng-repeat="num in [] | range:1:max track by $index"\
					ng-class="{ \'active\' : num <= rating }"\
					ng-click="select(num)"\
				></span>\
			</div>\
		',
		replace: true,

		controller: function($scope) {

			$scope.rating = $scope.rating || 0;

			$scope.select = function(num) {
				if ($scope.rating == num) {
					$scope.rating = 0;
				} else {
					$scope.rating = num;
				}
			};

		}
	};
});
