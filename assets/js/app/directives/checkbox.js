angular.module('HPApp').directive('checkbox', function() {
	return {
		restrict: 'E',
		template: function($element, $attrs) {
			var model = $attrs.model ? ' ng-model="' + $attrs.model + '"' : '',
				custom_true = $attrs.true ? ' ng-true-value="\'' + $attrs.true + '\'"' : '',
				custom_false = $attrs.false ? ' ng-false-value="\'' + $attrs.false + '\'"' : '';

			return '<input type="checkbox" ' + model + custom_true + custom_false + ' />';
		},
		replace: true,

		link: function($scope, $element, $attrs) {
			$element.after('<div class="custom-checkbox ' + ($attrs.class || '') + '"></div>');
		}
	};
});
