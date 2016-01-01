angular.module('HPApp').filter('userLinksExist', function() {
	return function(links) {
		var exist = false;

		angular.forEach(links, function(link) {
			if (link) {
				return exist = true;
			}
		});

		return exist;
	};
});
