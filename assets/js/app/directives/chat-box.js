angular.module('HPApp').directive('chatBox', function($templateCache) {
	return {
		restrict: 'E',
		template: $templateCache.get('chat-box.html'),
		replace: true,

		scope: {
			text: '=',
			opengraph: '=',
			attachments: '=',
			placeholder: '@',
			onSubmit: '&'
		},

		controller: function($scope, $element, $attrs) {

			$scope.model = {
				attachments: $scope.attachments,
				isAttachmentsBtnVisible: !!$attrs.attachments
			};



			$scope.removePhoto = function(index) {
				$scope.model.attachments.splice(index, 1);
			};

			$scope.submit = function() {
				$scope.onSubmit();
			};



			$scope.$watch('model.attachments', function(attachments) {
				$scope.attachments = attachments;
			});

		}
	};
});
