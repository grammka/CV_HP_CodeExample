angular.module('HPApp').directive('landingRolesChars', function(
	$templateCache, pluralTranslate
) {
	return {
		restrict: 'AE',
		scope: {
			data: '='
		},
		template: $templateCache.get('landing-roles-chars.html'),
		replace: true,

		link: function($scope) {

			var biggestUsersCountRole;

			$scope.getRole = function(count, role) {
				return pluralTranslate('LANDING.ALREADY_REGISTERED.PLURAL_ROLES.', role, count);
			};



			angular.forEach($scope.data, function(roleObj) {
				if (!biggestUsersCountRole || biggestUsersCountRole.users_count < roleObj.users_count) {
					biggestUsersCountRole = roleObj;
				}
			});

			angular.forEach($scope.data, function(roleObj) {
				roleObj.percentFromAllUsers = Math.ceil(100 * +roleObj.users_count / biggestUsersCountRole.users_count);
			});

		}
	};
});
