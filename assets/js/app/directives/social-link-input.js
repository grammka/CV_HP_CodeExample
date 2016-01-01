angular.module('HPApp').directive('socialLinkInput', function($timeout) {
	return {
		restrict: 'E',
		require: '^ngModel',
		scope: {
			ngModel: '=',
			config: '='
		},
		template: '<input type="text" class="input">',
		replace: true,

		link: function($scope, $element, $attrs, modelCtrl) {

			var placeholder, socialName;

			socialName = $attrs.placeholder;
			placeholder = 'http://' + socialName.toLowerCase() + '.com/';



			//$element.on('click', function() {
			//	if (!this.value) {
			//		this.value = placeholder;
			//
			//		setCaretToPos(this, this.value.length);
			//	}
			//});

			//$element.on('paste', function() {
			//	var self = this;
			//
			//	if (this.value == placeholder) {
			//		$timeout(function() {
			//			self.value = placeholder + self.value.match(/([^/]+)\/?$/)[1];
			//		});
			//	}
			//});

			//$element.on('blur', function() {
			//	if (this.value == placeholder) {
			//		this.value = null;
			//	}
			//});



			$timeout(function() {
				$element.attr('placeholder', placeholder);
			});

		}
	};
});
