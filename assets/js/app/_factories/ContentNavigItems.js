angular.module('HPApp').factory('ContentNavigItems', function() {
	var items = {
		profile: function(data) {
			var items = [
				{
					title: 'PROFILE.NAVIG.MAIN',
					sref: 'ws.profile.principal'
				},
				{
					title: 'PROFILE.NAVIG.PORTFOLIO',
					sref: 'ws.profile.portfolio'
				},
				{
					title: 'PROFILE.NAVIG.COLLEAGUES',
					sref: 'ws.profile.colleagues'
				}
			];

			if (data.currUser.id == data.user.id || data.currUser.role.name != data.user.role.name) {
				items.push({
					title: 'PROFILE.NAVIG.FEEDBACK',
					sref: 'ws.profile.feedback',
					//infoLink: '//hackpack.press/blog/wtf-is-hp-colleague-feedback/'
				});
			}

			if (data.currUser.id == data.user.id) {
				items.push({
					title: 'PROFILE.NAVIG.PRIVACY',
					sref: 'ws.profile.privacy',
					infoLink: '//hackpack.press/blog/wtf-is-hp-security/'
				});
			}

			return items;
		},

		organization: function(data) {
			var items = [
				{
					title: 'MY_COMPANY.NAVIG.MAIN',
					sref: 'ws.organization.principal'
				},
				{
					title: 'MY_COMPANY.NAVIG.USERS',
					sref: 'ws.organization.users'
				}
			];

			if (data.organization.permissions.is_admin && data.organization.permissions.edit_company) {
				items = items.concat([
					{
						title: 'MY_COMPANY.NAVIG.USER_REQUESTS',
						sref: 'ws.organization.userRequests'
					},
					{
						title: 'MY_COMPANY.NAVIG.SENT_REQUESTS',
						sref: 'ws.organization.sentRequests'
					}
				]);
			}

			return items;
		},

		snapFeedList: [
			{
				title: 'SNAP_FEED.LIST.NAVIG.ALL',
				sref: 'ws.snapFeed.list({category: "all"})'
			},
			{
				title: 'SNAP_FEED.LIST.NAVIG.SUBSCRIBED',
				sref: 'ws.snapFeed.list({category: "subscribed"})'
			},
			{
				title: 'SNAP_FEED.LIST.NAVIG.CREATED',
				sref: 'ws.snapFeed.list({category: "created"})'
			},
			{
				title: 'SNAP_FEED.LIST.NAVIG.ANSWERED',
				sref: 'ws.snapFeed.list({category: "answered"})'
			},
			{
				title: 'SNAP_FEED.LIST.NAVIG.HIDDEN',
				sref: 'ws.snapFeed.list({category: "hidden"})'
			}
		]
	};

	return {
		get: function(name, data) {
			if (!items[name]) {
				return console.error('ContentNavigItems.' + name + ' not found!');
			}

			if (typeof items[name] == 'function') {
				return items[name](data);
			} else {
				return items[name];
			}
		}
	}
});
