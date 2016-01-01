angular.module('HPApp').directive('switchLanguageBtn', function(
	$translate, $timeout,
	localization
) {
	return {
		restrict: 'A',

		link: function($scope, $element) {

			$element.on('click', function() {
				$timeout(function() {
					localization.update($translate.use() == 'ruRU' ? 'enUS' : 'ruRU');
				});
			});

		}
	};
});
