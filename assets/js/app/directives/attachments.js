angular.module('HPApp').directive('attachments', function($rootScope, $templateCache) {
	return {
		require: '^form',
		restrict: 'E',
		template: $templateCache.get('attachments.html'),
		replace: true,

		scope: {
			attachments: '=model',
			button: '=', // if button needed
			maxTotalSize: '@',
			thumbSize: '@'
		},

		link: function($scope, $element, $attrs, formCtrl) {

			$scope.model = {
				attachments: $scope.attachments,
				totalSize: 0,
				thumbSize: $scope.thumbSize || 120
			};


			$scope.removePhoto = function(index) {
				$scope.model.attachments.splice(index, 1);
				$scope.model.attachments = $scope.model.attachments.slice(0);
			};


			$scope.$watch('model.attachments', function(attachments) {
				var totalSize = 0;

				$scope.attachments = attachments;

				angular.forEach(attachments, function(attachment) {
					attachment.sizeInMB = parseFloat((+attachment.size / 1024 / 1024).toFixed(2)) + 'MB';
					totalSize += +attachment.size / 1024 / 1024;
				});

				$scope.totalSize = parseFloat(totalSize.toFixed(2));

				formCtrl.$setValidity('attachments', $scope.totalSize < $scope.maxTotalSize);
			});

		}
	};
});
