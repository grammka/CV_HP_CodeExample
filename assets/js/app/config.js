angular.module('HPApp').config([
	'$provide',
	'$locationProvider',
	'$stateProvider',
	'$urlRouterProvider',
	'$httpProvider',
	'$translateProvider',
	'tooltipsConfigProvider',
	'cfpLoadingBarProvider',
	'localStorageServiceProvider',
	function(
		$provide,
		$locationProvider,
		$stateProvider,
		$urlRouterProvider,
		$httpProvider,
		$translateProvider,
		tooltipsConfigProvider,
		cfpLoadingBarProvider,
		localStorageServiceProvider
	) {

		// Template cache clear ------------------------------------------------------------- /

		// Set a suffix outside the decorator function
		var cacheBuster = Date.now().toString();
		$provide.decorator('$templateFactory', ['$delegate', function($delegate) {
			var fromUrl = angular.bind($delegate, $delegate.fromUrl);
			$delegate.fromUrl = function (url, params) {
				if (url !== null && angular.isDefined(url) && angular.isString(url)) {
					url += (url.indexOf("?") === -1 ? "?" : "&");
					url += "v=" + cacheBuster;
				}

				return fromUrl(url, params);
			};
			return $delegate;
		}]);


		// Configure ------------------------------------------------------------------------ /

		$httpProvider.defaults.withCredentials = true;
		$httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
		$httpProvider.defaults.headers.common['X-Requested-With'] ='XMLHttpRequest';

		localStorageServiceProvider.setPrefix('HPApi');

		cfpLoadingBarProvider.includeSpinner = false;

		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});

		$translateProvider
			.useSanitizeValueStrategy('escaped')
			.preferredLanguage('enUS')
			.useStaticFilesLoader({
				prefix: '/data/json/',
				suffix: '.json'
			})
			.fallbackLanguage(['ruRU', 'enUS']);

		tooltipsConfigProvider.options({
			delay: 0,
			speed: '0',
			lazy: false,
			size: 'small'
		});


		// Routing ------------------------------------------------------------------------ /

		$urlRouterProvider.otherwise('/snap-feed/list/?category=all');

		$urlRouterProvider.when('/snap-feed/', function($state) {
			$state.go('ws.snapFeed.list', {category: 'all'});
		});
		$urlRouterProvider.when('/profile/:userId', function ($match, $state) {
			$state.go('ws.profile.principal', {userId: $match.organizationId});
		});
		$urlRouterProvider.when('/organization/:organizationId', function ($match, $state) {
			$state.go('ws.organization.principal', {organizationId: $match.organizationId});
		});

		$stateProvider

			.state('request', {
				abstract: true,
				template: '<div ui-view />'
			})
				.state('request.signWithSocial', {
					url: '/sign-with-social/:provider',
					controller: 'SignWithSocialCtrl'
				})
				.state('request.byInvitation', {
					url: '/by-invitation/?code',
					controller: 'RequestByInvitationCtrl'
				})
				.state('request.changePassword', {
					url: '/change-password/?code',
					controller: 'RequestChangePasswordCtrl'
				})
				.state('request.confirmEmail', {
					url: '/confirm-email/?code',
					controller: 'RequestConfirmEmailCtrl'
				})
				.state('request.changeEmail', {
					url: '/change-email/?code',
					controller: 'RequestChangeEmailCtrl'
				})
				.state('request.acceptColleagueRequest', {
					url: '/accept-colleague-request/?id',
					controller: 'RequestAcceptColleagueRequestCtrl'
				})
				.state('request.declineColleagueRequest', {
					url: '/decline-colleague-request/?id',
					controller: 'RequestDeclineColleagueRequestCtrl'
				})
				.state('request.acceptCompanyRequest', {
					url: '/accept-company-request/?id',
					controller: 'RequestAcceptCompanyRequestCtrl'
				})
				.state('request.declineCompanyRequest', {
					url: '/decline-company-request/?id',
					controller: 'RequestDeclineCompanyRequestCtrl'
				})

			// Common ------------------------------------------------ /

			.state('about', {
				url: '/about/',
				templateUrl: '/about.html'
			})
			.state('prices', {
				url: '/prices/',
				templateUrl: '/prices.html'
			})
			.state('privacyPolicy', {
				url: '/privacy-policy/',
				controller: 'PrivacyPolicyCtrl',
				templateUrl: '/privacy-policy.html'
			})
			.state('termsOfUse', {
				url: '/terms-of-use/',
				controller: 'TermsOfUseCtrl',
				templateUrl: '/terms-of-use.html'
			})

			// Site -------------------------------------------------- /

			.state('404', {
				url: '/404/',
				templateUrl: '/404.html'
			})
			.state('landing', {
				url: '/',
				controller: 'LandingCtrl',
				templateUrl: '/landing.html',
				resolve: {
					mapData: function(LandingFactory) {
						return LandingFactory.getMapData();
					},
					//charsData: function(LandingFactory) {
					//	return LandingFactory.getCharsData();
					//}
				}
			})
			.state('signIn', {
				url: '/signin/?code&section',
				controller: 'SignInCtrl',
				templateUrl: 'signin.html'
			})
			.state('configProfile', {
				url: '/config-profile/',
				controller: 'ConfigProfileCtrl',
				templateUrl: 'config-profile.html'
			})
			.state('payment', {
				url: '/payment/',
				controller: 'PaymentCtrl',
				templateUrl: 'payment.html'
			})

			// With Sidebar ------------------------------------------ /

			.state('ws', {
				abstract: true,
				controller: 'SidebarCtrl',
				templateUrl: '/_layouts/with-sidebar.html',
				resolve: {
					options: function(staticData) {
						return staticData.load();
					}
				}
			})
				.state('ws.search', {
					url: '/search/',
					controller: 'SearchCtrl',
					templateUrl: '/search.html'
				})
				.state('ws.profile', {
					url: '/profile/:userId?',
					controller: 'ProfileCtrl',
					templateUrl: '/profile.html',
					resolve: {
						user: function(ProfileFactory, $stateParams) {
							return ProfileFactory.getData($stateParams.userId);
						}
					}
				})
					.state('ws.profile.principal', {
						url: '/principal/',
						views: {
							'content': {
								controller: 'ProfilePrincipalCtrl',
								templateUrl: '/profile.principal.html'
							}
						}
					})
					.state('ws.profile.portfolio', {
						url: '/portfolio/',
						views: {
							'content': {
								controller: 'ProfilePortfolioCtrl',
								templateUrl: '/profile.portfolio.html'
							}
						}
					})
					.state('ws.profile.feedback', {
						url: '/feedback/',
						views: {
							'content': {
								controller: 'ProfileFeedbackCtrl',
								templateUrl: '/profile.feedback.html'
							}
						},
						resolve: {
							feedbackOptions: function(ProfileFactory, $stateParams) {
								return ProfileFactory.getFeedbackOptions($stateParams.userId);
							}
						}
					})
					.state('ws.profile.colleagues', {
						url: '/colleagues/',
						views: {
							'content': {
								controller: 'ProfileColleaguesCtrl',
								templateUrl: '/profile.colleagues.html'
							}
						}
					})
					.state('ws.profile.privacy', {
						url: '/privacy/',
						views: {
							'content': {
								controller: 'ProfilePrivacyCtrl',
								templateUrl: '/profile.privacy.html'
							}
						}
					})
				.state('ws.createOrganization', {
					url: '/organization/create/',
					controller: 'OrganizationCreateCtrl',
					templateUrl: '/organization.create.html'
				})
				.state('ws.organization', {
					url: '/organization/:organizationId',
					controller: 'OrganizationCtrl',
					templateUrl: '/organization.html',
					resolve: {
						organization: function(OrganizationFactory, $stateParams) {
							return OrganizationFactory.getData($stateParams.organizationId);
						}
					}
				})
					.state('ws.organization.principal', {
						url: '/principal/',
						views: {
							'content': {
								controller: 'OrganizationPrincipalCtrl',
								templateUrl: '/organization.principal.html'
							}
						}
					})
					.state('ws.organization.users', {
						url: '/users/',
						views: {
							'content': {
								controller: 'OrganizationUsersCtrl',
								templateUrl: '/organization.users.html'
							}
						}
					})
					.state('ws.organization.userRequests', {
						url: '/user-requests/',
						views: {
							'content': {
								controller: 'OrganizationUserRequestsCtrl',
								templateUrl: '/organization.user-requests.html'
							}
						}
					})
					.state('ws.organization.sentRequests', {
						url: '/sent-requests/',
						views: {
							'content': {
								controller: 'OrganizationSentRequestsCtrl',
								templateUrl: '/organization.sent-requests.html'
							}
						}
					})
				.state('ws.messenger', {
					url: '/messenger/:userId',
					controller: 'MessengerCtrl',
					templateUrl: '/messenger.html'
				})
					.state('ws.messenger.opponent', {
						url: '/:opponentId'
					})
				.state('ws.snapFeed', {
					abstract: true,
					url: '/snap-feed/',
					template: '<div ui-view />',
					resolve: {
						options: function(options, snapFeedOptions) {
							return snapFeedOptions.load();
						}
					}
				})
					.state('ws.snapFeed.list', {
						url: 'list/?category',
						params: {
							category: 'all'
						},
						controller: 'SnapFeedListCtrl',
						templateUrl: '/snap-feed.list.html'
					})
					.state('ws.snapFeed.edit', {
						url: 'edit/:snapId',
						controller: 'SnapFeedEditCtrl',
						templateUrl: '/snap-feed.edit.html'
					})
					.state('ws.snapFeed.subscribe', {
						url: 'subscribe/',
						controller: 'SnapFeedSubscribeCtrl',
						templateUrl: '/snap-feed.subscribe.html'
					})
					.state('ws.snapFeed.preview', {
						url: 'preview/:snapId',
						controller: 'SnapFeedPreviewCtrl',
						templateUrl: '/snap-feed.preview.html'
					})
					.state('ws.snapFeed.snap', {
						url: 'snap/:snapId',
						controller: 'SnapFeedSnapCtrl',
						templateUrl: '/snap-feed.snap.html'
					})
				.state('ws.settings', {
					url: '/settings/',
					controller: 'SettingsCtrl',
					templateUrl: '/settings.html'
				});

	}
]);
