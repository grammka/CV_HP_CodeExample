angular.module('HPApp').factory('companiesAPI', function(
	$rootScope,
	sharedData, notifyErrors, apiRequest,
	photosAPI, usersAPI
) {
	var API = {};


	API.create = function(params) {
		return apiRequest('companies', 'POST', params).success(function(response) {
			usersAPI.set({companies: [response]});
		});
	};

	API.leave = function(organizationId) {
		return apiRequest('companies/' + organizationId + '/leave/', 'DELETE').success(function() {
			// TODO rewrite when user will be able to have more than 1 company
			usersAPI.set({companies: []});
		});
	};

	API.get = function(params) {
		return apiRequest('companies', null, params || {});
	};

	API.getById = function(organizationId) {
		return apiRequest('companies/' + organizationId);
	};

	API.update = function(organizationId, data) {
		return apiRequest('companies/' + organizationId, 'PATCH', data);
	};

	API.uploadPhoto = function(organizationId, file) {
		return photosAPI.upload('companies/' + organizationId + '/photo/', file);
	};

	API.checkExist = function(websiteUrl) {
		return apiRequest('companies/exist', null, {website: websiteUrl})
			.error(notifyErrors);
	};

	API.getUsers = function(organizationId) {
		return apiRequest('companies/' + organizationId + '/members/');
	};

	// Company Invite Requests ----------------------------------------------------------------- /

	API.getUsersRequests = function(organizationId) {
		return apiRequest('companies/' + organizationId + '/members/requests/in');
	};

	API.acceptUserRequest = function(organizationId, userId) {
		return apiRequest('companies/' + organizationId + '/members/requests/in', 'POST', {profile_id: userId, confirmed: true})
			.error(notifyErrors);
	};

	API.declineUserRequest = function(organizationId, userId) {
		return apiRequest('companies/' + organizationId + '/members/requests/in', 'POST', {profile_id: userId, confirmed: false})
			.error(notifyErrors);
	};

	API.getSentRequests = function(organizationId) {
		return apiRequest('companies/' + organizationId + '/members/requests/out');
	};

	API.inviteHackPackMember = function(organizationId, userId) {
		return apiRequest('companies/' + organizationId + '/members/requests/out', 'POST', {profile_id: userId})
			.success(function() {
				mixpanel.track('Success: Company sent invite to HP member', {organizationId: organizationId, userId: userId});
			})
			.error(notifyErrors);
	};

	API.inviteUserViaEmail = function(organizationId, data) {
		return apiRequest('companies/' + organizationId + '/invite', 'POST', data)
			.success(function() {
				mixpanel.track('Success: Company sent invite via email', {organizationId: organizationId, data: data});
			})
			.error(notifyErrors);
	};

	// User Invite Requests -------------------------------------------------------------------- /

	API.getCompaniesRequest = function() {
		return apiRequest('companies/my_requests/in');
	};

	API.acceptCompanyRequest = function(organizationId) {
		return apiRequest('companies/my_requests/in', 'POST', {company_id: organizationId, confirmed: true})
			.success(function(response) {
				usersAPI.set({companies: [response.company]});
			})
			.error(notifyErrors);
	};

	API.declineCompanyRequest = function(organizationId) {
		return apiRequest('companies/my_requests/in', 'POST', {company_id: organizationId, confirmed: false})
			.error(notifyErrors);
	};

	API.getRequestsToCompanies = function() {
		return apiRequest('companies/my_requests/out');
	};

	API.requestToBeAMember = function(organizationId) {
		return apiRequest('companies/my_requests/out', 'POST', {company_id: organizationId})
			.success(function() {
				mixpanel.track('Success: User request invite from Company');
			}).error(function(response, statusCode) {
				notifyErrors(response);
				mixpanel.track('Error: User request invite from Company', {
					code: statusCode,
					response: response
				});
			});
	};
	
	// Admins --------------------------------------------------------------------- /

	API.updateAdmin = function(organizationId, userId, data) {
		return apiRequest('companies/' + organizationId + '/admins/' + userId, 'PATCH', data)
			.error(notifyErrors);
	};

	API.removeMember = function(organizationId, userId) {
		return apiRequest('companies/' + organizationId + '/members/' + userId, 'DELETE').success(function() {
			mixpanel.track('Success: Remove member from Company');
		}).error(function(response) {
			notifyErrors(response, statusCode);
			mixpanel.track('Error: Remove member from Company', {
				code: statusCode,
				response: response
			});
		});
	};

	// Experts --------------------------------------------------------------------- /

	API.getExperts = function(organizationId) {
		return apiRequest('companies/' + organizationId + '/experts')
			.error(notifyErrors);
	};

	API.createExpertPage = function(organizationId, data) {
		return apiRequest('companies/' + organizationId + '/experts', 'POST', data)
			.error(notifyErrors);
	};

	API.updateExpert = function(organizationId, userId, data) {
		return apiRequest('companies/' + organizationId + '/experts/' + userId, 'PATCH', data)
			.error(notifyErrors);
	};

	API.changeExpertAdminStatus = function(organizationId, userId, isAdmin) {
		return apiRequest('companies/' + organizationId + '/experts/' + userId, 'PATCH', {is_admin: isAdmin})
			.error(notifyErrors);
	};

	API.giveProfileAccessToExpert = function(organizationId, userId, email) {
		return apiRequest('companies/' + organizationId + '/experts/' + userId + '/email', 'PATCH', {email: email})
			.error(notifyErrors);
	};


	return API;
});
