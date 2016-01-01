angular.module('HPApp').factory('usersAPI', function(
	$rootScope, $http, $location, $filter, $stateParams,
	notifyErrors, sharedData, apiRequest,
	photosAPI
) {
	var API = {};

	function getUserId(userId) {
		return userId || $stateParams.userId || sharedData.get('user.sv.id') || 'me';
	}



	API.set = function(data) {
		mixpanel.people.set({
			"$id": data.id,
			"$first_name": data.first_name,
			"$last_name": data.last_name,
			"$email": data.email
		});
		mixpanel.identify(data.id);

		if (sharedData.get('user')) {
			angular.extend(sharedData.user.sv, data);
		} else {
			sharedData.set('user', data);
		}
	};



	API.getList = function(params) {
		return apiRequest('users', 'GET', params || {});
	};

	API.getNextPageList = function(url, params) {
		return $http.get(url, {params: params || {}});
	};

	API.getByName = function(query) {
		return apiRequest('users/name_search', 'GET', {search: query});
	};

	API.getById = function(userId) {
		return apiRequest('users/' + getUserId(userId))
			.error(function() {
				noty({
					text: $filter('translate')('NOTIFICATIONS.USER_PROFILE_NOT_FOUND'),
					type: 'error'
				});
			});
	};

	API.update = function(userId, data) {
		userId = getUserId(userId);

		return apiRequest('users/' + userId, 'PATCH', data)
			.success(function(response) {
				mixpanel.track('Success: Profile saved', response);

				if (sharedData.get('user.sv.id') == userId) {
					API.set(response);
				}
			})
			.error(function(response, statusCode) {
				mixpanel.track('Error: Profile not saved', {
					data: data,
					code: statusCode,
					response: response
				});
			});
	};

	API.uploadPhoto = function(userId, file) {
		return photosAPI.upload('users/' + getUserId(userId) + '/photo/', file);
	};

	API.invite = function(data) {
		return apiRequest('users/invite', 'POST', data)
			.error(notifyErrors);
	};


	// Articles ----------------------------------------------------------- /

	API.getArticles = function(userId) {
		return apiRequest('users/' + getUserId(userId) + '/articles');
	};

	API.createArticle = function(userId, data) {
		return apiRequest('users/' + getUserId(userId) + '/articles', 'POST', data)
			.error(notifyErrors);
	};

	API.updateArticle = function(userId, articleId, data) {
		return apiRequest('users/' + getUserId(userId) + '/articles/' + articleId, 'PATCH', data)
			.error(notifyErrors);
	};

	API.removeArticle = function(userId, articleId) {
		return apiRequest('users/' + getUserId(userId) + '/articles/' + articleId, 'DELETE')
			.error(notifyErrors);
	};


	// Landing ----------------------------------------------------------- /

	API.getUsersForMap = function() {
		return apiRequest('users/map');
	};

	API.getUsersRolesForChars = function() {
		return apiRequest('users/by_roles');
	};


	return API;
});
