angular.module('HPApp').directive('searchCompaniesByWebsite', function(companiesAPI) {
	return {
		resctrict: 'A',
		scope: {
			ngModel: '=',
			onSearch: '&',
			onClearSearch: '&'
		},
		link: function($scope) {

			$scope.$watch('ngModel', function(newVal) {
				if (newVal && /^.+\..+$/.test(newVal)) {
					companiesAPI.get({website: newVal}).success(function(response) {
						$scope.onSearch({organization: response[0]});
					});
				} else {
					$scope.onClearSearch();
				}
			}, true);

		}
	};
});
