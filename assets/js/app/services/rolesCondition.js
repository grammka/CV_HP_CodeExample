angular.module('HPApp').service('rolesCondition', function(sharedData) {
	//var roles = {
	//	'Journalist': 'Journalist',
	//	'Photographer': 'Photographer',
	//	'Videographer': 'Videographer',
	//	'Fixer': 'Fixer',
	//	'Expert': 'Expert',
	//	'Editor': 'Editor / Media Outlet',
	//	'PR': 'PR Professional / PR agency, University, Company',
	//	'NGO': 'PR Professional (NGO)'
	//};

	return function(role, modelRole) {
		return (modelRole || sharedData.get('user.sv.role')) == role;
	};
});