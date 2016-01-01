angular.module('HPApp').factory('LandingFactory', function(usersAPI) {
	return {
		getMapData: function() {
			console.info('landing map data is loading...');
			return usersAPI.getUsersForMap().then(function(response) {
				return response.data;
			});
		},
		getCharsData: function() {
			console.info('landing chars data is loading...');
			return usersAPI.getUsersRolesForChars().then(function(response) {
				return response.data;
			});
		}
	};
});
