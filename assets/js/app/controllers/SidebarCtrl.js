angular.module('HPApp').controller('SidebarCtrl', function(
	$rootScope, $scope, $location, $timeout, $state,
	principal, localStorageService, ngDialog, confirmClickDialog, sharedData, rolesCondition,
	authAPI
) {

	$scope.model = {
		user: sharedData.user,
		newMessagesCount: sharedData.get('user.sv.new_messages'),
		companyInvitesCount: sharedData.get('user.sv.company_invites')
	};

	$scope.model.navigation = [
		{
			title: 'SIDEBAR.NAVIG.SEARCH',
			icon: 'sl-icon-search',
			route: 'ws.search'
		},
		{
			title: 'SIDEBAR.NAVIG.MY_PROFILE',
			icon: 'sl-icon-account-circle-1',
			route: (function() {
				return 'ws.profile.principal({userId: ' + sharedData.get('user.sv.id') + '})';
			})()
		},
		{
			title: 'SIDEBAR.NAVIG.MY_COMPANY',
			icon: 'sl-icon-building-11',
			route: (function() {
				var organizationId = sharedData.get('user.sv.companies[0].id');
				return organizationId ? 'ws.organization.principal({organizationId: ' + organizationId + '})' : 'ws.createOrganization';
			})(),
			count: 'companyInvitesCount'
		},
		//{
		//	title: 'SIDEBAR.NAVIG.MY_HACK_PACKS',
		//	icon: 'sl-icon-globe-2',
		//	route: (function() {
		//		return 'ws.hackPacks({slug: "' + (sharedData.get('user.sv.last_hackpack') || 'Russia') + '"})';
		//	})(),
		//	hidden: function() {
		//		return rolesCondition('Expert') || rolesCondition('PR') || rolesCondition('NGO');
		//	}
		//},
		{
			title: 'SIDEBAR.NAVIG.MESSENGER',
			icon: 'sl-icon-chat-double-bubble-2',
			route: 'ws.messenger({userId: null})',
			count: 'newMessagesCount'
		},
		{
			title: 'SIDEBAR.NAVIG.SNAP_FEED',
			icon: 'sl-icon-flash-2',
			route: 'ws.snapFeed.list'
		}
	];

	$scope.model.userNavigation = [
		{
			title: 'SIDEBAR.NAVIG.FEEDBACK',
			icon: 'sl-icon-report-problem-triangle',
			onClick: function() {
				ngDialog.open({
					controller: 'DialogFeedbackCtrl',
					template: 'dialogs/feedback.html',
					closeByEscape: true,
					closeByDocument: true
				});
			}
		},
		{
			title: 'SIDEBAR.NAVIG.INVITE',
			icon: 'sl-icon-person-add-2',
			onClick: function() {
				ngDialog.open({
					controller: 'DialogInviteMembersCtrl',
					template: 'dialogs/invite-members.html'
				});
			}
		},
		{
			title: 'SIDEBAR.NAVIG.SETTINGS',
			icon: 'sl-icon-cog',
			onClick: function() {
				$state.go('ws.settings');
			}
		},
		{
			title: 'SIDEBAR.NAVIG.LOGOUT',
			icon: 'sl-icon-logout-2',
			onClick: function() {
				confirmClickDialog().then(function(response) {
					if (response.value === true) {
						authAPI.logout().success(function() {
							principal.authenticate(null);
						});
					}
				});
			}
		}
	];



	$scope.hideDummyMobileVersion = function() {
		$scope.model.dummyMobileVersionHidden = true;
		localStorageService.set('dummyMobileVersion:Hidden', true);
	};

	$scope.toggleLock = function (state) {
		if (typeof state == 'undefined') {
			state = localStorageService.get('sidebarLocked');
			state ^= 1;
		}

		$rootScope.sidebarLocked = state;
		localStorageService.set('sidebarLocked', state);
	};



	$scope.$on('WS.Messenger.update', function(event, message) {
		if ($scope.model.currUserId != message.author) {
			$timeout(function() {
				$scope.model.newMessagesCount = +sharedData.get('user.sv.new_messages') + 1;
			});

			if ($scope.model.user.sv.notification_settings.messenger) {
				$('#incomingMessage')[0].play();
			}

			var chatUrl = '/messenger/' + $scope.model.user.sv.id + '/' + message.author.id;

			//noty({
			//	text: '<a href="' + chatUrl + '"><b>' + message.author.full_name + ' wrote:</b></a><br><a href="' + chatUrl + '">' + message.text + '</a>',
			//	type: 'information'
			//});

			noty({
				text: '<b>' + message.author.full_name + ' wrote:</b><br>' + message.text,
				type: 'information'
			});
		}
	});

	$rootScope.$on('Messenger.openChat.clearUnread', function(count) {
		$scope.model.newMessagesCount -= count;
	});

	$rootScope.$on('clearCompanyInvites', function() {
		$scope.model.companyInvitesCount = 0;
	});

});
