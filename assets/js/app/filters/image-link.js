angular.module('HPApp').filter('imageLink', function($rootScope, $sce) {
	return function(path) {
		if (path) {
			if (!/https?:\/\//.test(path)) {
				path = path.replace(/^\//, '');
				path = $rootScope.apiPath + path;
			}
		} else {
			path = '/data/img/logo90deg.svg';
		}

		return $sce.trustAsResourceUrl(path);
	};
});
