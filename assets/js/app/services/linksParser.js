angular.module('HPApp').service('linksParser', function() {
	return function(value) {
		return Autolinker.link(value, {
			className: "t-link",
			twitter: false,
			hashtag: false
		})
	};
});
