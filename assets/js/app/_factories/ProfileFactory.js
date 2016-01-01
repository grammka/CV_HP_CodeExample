angular.module('HPApp').factory('ProfileFactory', function(
	$q, $state,
	sharedData,
	usersAPI, colleaguesAPI, feedbackAPI
) {
	return {
		getData: function(userId) {
			console.info('user data is loading...');

			var currUserId = sharedData.get('user.sv.id');

			if (userId == currUserId) {
				console.info('user data loaded from sharedData');
				return sharedData.get('user.sv');
			} else {
				var defer = $q.defer();

				usersAPI.getById(userId)
					.success(function(response) {
						console.info('user data loaded from server');
						defer.resolve(response);
					})
					.error(function() {
						$state.go('ws.profile.principal', {userId: currUserId}, {notify: false});
						defer.resolve(sharedData.get('user.sv'));
					});

				return defer.promise;
			}
		},

		getPortfolioData: function(userId) {
			console.info('user portfolio is loading...');

			return usersAPI.getArticles(userId).then(function(response) {
				return response.data;
			});
		},

		getColleaguesData: function(userId) {
			console.info('user colleagues are loading...');

			return colleaguesAPI.getByUserId(userId).then(function(response) {
				return response.data;
			});
		},

		getSuggestionsData: function() {
			console.info('user suggestions are loading...');

			return colleaguesAPI.getFacebookFriends().then(function(response) {
				return response.data;
			});
		},

		getFeedbackData: function(userId) {
			console.info('user feedback posts are loading...');

			return feedbackAPI.getList(userId).then(function(response) {
				return response.data;
			});
		},
	
		getFeedbackOptions: function(userId) {
			console.info('user feedback options are loading...');

			return feedbackAPI.getOptions(userId).then(function(response) {
				return response.data;
			});
		}
	};
});
