angular.module('HPApp').factory('OrganizationFactory', function(
	$q, $state,
	sharedData,
	companiesAPI
) {
	return {
		getData: function(organizationId) {
			console.info('organization data is loading...');

			var defer = $q.defer();

			function getData(organizationId) {
				return companiesAPI.getById(organizationId).success(function(response) {
					console.info('organization data loaded from server');
					defer.resolve(response);
				});
			}

			getData(organizationId).error(function() {
				organizationId = sharedData.get('user.sv.companies[0].id');

				if (organizationId) {
					$state.go('ws.organization.principal', {organizationId: organizationId}, {notify: false});

					getData(organizationId).error(function() {
						defer.reject();
						$state.go('ws.profile.principal', {userId: sharedData.get('user.sv.id')});
					});
				} else {
					defer.reject();
					$state.go('ws.profile.principal', {userId: sharedData.get('user.sv.id')});
				}
			});

			return defer.promise;
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
		}
	};
});
