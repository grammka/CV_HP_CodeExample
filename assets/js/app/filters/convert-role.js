angular.module('HPApp').filter('convertRole', function() {
	var roles = {
		'Journalist': 'Journalist',
		'Photographer': 'Photographer',
		'Videographer': 'Videographer',
		'Fixer': 'Fixer',
		'Expert': 'Expert',
		'Editor': 'Editor',
		'PR': 'PR Professional',
		'NGO': 'PR Professional'
	};
	
	return function(modelRole) {
		return roles[modelRole];
	};
});
