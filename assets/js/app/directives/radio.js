angular.module('HPApp').directive('radio', function() {
	return {
		restrict: 'E',
		replace: true,

		template: function($element, $attrs) {
			return '<input type="radio" class="b-hidden-radio" ng-model="' + $attrs.model + '" value="' + $attrs.value + '">';
		},

		link: function($scope, $element, $attrs) {

			$element.after('<div class="custom-radio ' + ($attrs.class || '') + '"></div>');

		}
	};
});
