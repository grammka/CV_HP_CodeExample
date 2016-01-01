angular.module('HPApp').factory('HackPackFactory', function($rootScope, hackPackAPI) {
	return {
		getBoardsData: function(slug) {
			console.info('HP boards are loading...');

			return hackPackAPI.getBoards().then(function(response) {
				return response.data;
			});
		},

		getHackPackData: function(slug) {
			console.info('HP data is loading...');

			return hackPackAPI.getBySlug(slug).then(function(response) {
				return response.data;
			});
		},

		getMembersData: function(slug) {
			console.info('HP members are loading...');

			return hackPackAPI.getMembers(slug).then(function(response) {
				return response.data;
			});
		},

		getNewMembersData: function(slug) {
			console.info('HP new members are loading...');

			return hackPackAPI.getNewMembers(slug).then(function(response) {
				return response.data;
			});
		},

		getPostsData: function(slug) {
			console.info('HP posts are loading...');

			return hackPackAPI.getPosts(slug).then(function(response) {
				return response.data;
			});
		}
	};
});
