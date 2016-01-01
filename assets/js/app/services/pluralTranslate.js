angular.module('HPApp').service('pluralTranslate', function($filter) {
	return function(jsonPath, jsonKey, count) {
		var plurals, result;

		plurals = $filter('translate')(jsonPath + jsonKey.toUpperCase()).split('# #');
		result  = $filter('plural').apply(null, [count].concat(plurals));

		return result;
	};
});
