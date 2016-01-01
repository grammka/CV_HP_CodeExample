angular.module('HPApp').controller('SignWithSocialCtrl', function(
	$scope, $stateParams,
	principal, redirect,
	authAPI
) {

	if (principal.isAuthenticated()) {
		return redirect.inside();
	}

	var socials = {
		facebook: null,
		twitter: null,
		linkedin: null
	};

	OAuth.callback($stateParams.provider)
		.done(function(response) {
			var tokens;

			if ($stateParams.provider == 'facebook') {
				tokens = {
					access_token: response.access_token
				};
			} else if ($stateParams.provider == 'twitter') {
				tokens = {
					oauth_token: response.oauth_token,
					oauth_token_secret: response.oauth_token_secret
				};
			} else if ($stateParams.provider == 'linkedin') {
				tokens = {
					oauth_token: response.oauth_token,
					oauth_token_secret: response.oauth_token_secret
				};
			}

			socials[$stateParams.provider] = tokens;

			authAPI.signWithSocial(socials).success(function() {
				redirect.inside();
			});
		})
		.fail(function (err) {
			console.error(err);
		});

});
