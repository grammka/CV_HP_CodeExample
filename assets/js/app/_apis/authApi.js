angular.module('HPApp').factory('authAPI', function(
	$state, $filter,
	apiRequest, localization, sharedData, notifyErrors, braintreeSrvs,
	usersAPI
) {
	var API = {};


	API.getCurrent = function() {
		return apiRequest('users/me')
			.success(function(response) {
				usersAPI.set(response);
				braintreeSrvs.setToken();

				if (response.interface_language) {
					localization.update(response.interface_language);
				}
			});
	};

	API.signIn = function(data) {
		return apiRequest('auth/password', 'POST', data)
			.success(function(response) {
				usersAPI.set(response);
				braintreeSrvs.setToken();
			})
			.error(function(response, statusCode) {
				notifyErrors(response);
				mixpanel.track('Error: Sign In', {
					code: statusCode,
					response: response
				});
			});
	};

	API.signWithSocial = function(socials) {
		return apiRequest('auth/register/token/new', 'POST', {socials: socials}).success(function(response) {
			usersAPI.set(response);
		});
	};

	API.signInWithNewPassword = function(data) {
		return apiRequest('auth/password/code', 'POST', data)
			.success(function(response) {
				usersAPI.set(response);
				API.getCurrent();
			})
			.error(function(response, statusCode) {
				notifyErrors(response);
				mixpanel.track('Error: Sign In with new Password', {
					code: statusCode,
					response: response
				});
			});
	};

	API.signUp = function(data) {
		return apiRequest('auth/register/new', 'POST', data)
			.success(function(response) {
				usersAPI.set(response);
				braintreeSrvs.setToken();

				mixpanel.track('New user registered!', {
					data: data,
					response: response
				});
			})
			.error(function(response, statusCode) {
				notifyErrors(response);
				mixpanel.track('Error: Sign Up', {
					code: statusCode,
					response: response
				});
			});
	};

	API.logout = function() {
		return apiRequest('auth/logout')
			.success(function() {
				sharedData.set('user', null);
				$state.go('landing');
			})
			.error(notifyErrors);
	};




	API.getInviteData = function(code) {
		return apiRequest('users/invite/data', 'GET', {code: code})
			.error(notifyErrors);
	};

	API.resendConfirmationEmail = function() {
		return apiRequest('auth/confirm_email/resend', 'POST')
			.error(function(response, statusCode) {
				notifyErrors(response);
				mixpanel.track('Error: Resend email confirmation', {
					code: statusCode,
					response: response
				});
			});
	};

	API.confirmEmail = function(code) {
		console.info('Email confirmation process...');

		return apiRequest('auth/confirm_email', 'POST', {code: code})
			.success(function() {
				console.info('Email confirmed');
				usersAPI.set({is_email_confirmed: true});

				noty({
					text: $filter('translate')('NOTIFICATIONS.EMAIL_CONFIRMED'),
					type: 'success'
				});
			})
			.error(function(response) {
				console.error('Email not confirmed');
				notifyErrors(response);
			});
	};

	API.changeEmail = function(data) {
		return apiRequest('auth/change_email', 'POST', data)
			.error(notifyErrors);
	};

	API.confirmEmailChanging = function(code) {
		console.info('New Email confirmation process...');

		return apiRequest('auth/confirm_email', 'POST', {code: code})
			.success(function(response) {
				console.info('New Email confirmed');
				usersAPI.set({email: response.email});

				noty({
					text: $filter('translate')('NOTIFICATIONS.NEW_EMAIL_CONFIRMED'),
					type: 'success'
				});
			})
			.error(function(response) {
				console.error('New Email not confirmed');
				notifyErrors(response);
			});
	};

	API.confirmTerms = function() {
		return usersAPI.update(null, {is_terms_confirmed: true});
	};

	API.resetPassword = function(email) {
		return apiRequest('auth/password/reset', 'POST', {email: email})
			.success(function() {
				if (sharedData.get('user.sv')) {
					API.logout();
				}
			})
			.error(function(response, statusCode) {
				notifyErrors(response);
				mixpanel.track('Error: Reset Password', {
					code: statusCode,
					response: response
				});
			});
	};

	/**
	 * Update password
	 * @param data {{old_password: 'string', new_password: 'string'}}
	 */
	API.changePassword = function(data) {
		return apiRequest('auth/password/change', 'POST', data)
			.error(function(response, statusCode) {
				notifyErrors(response);
				mixpanel.track('Error: Change password', {
					code: statusCode,
					response: response
				});
			});
	};


	return API;
});
