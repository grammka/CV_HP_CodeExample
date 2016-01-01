angular.module('HPApp').directive('snapFeedAuthorPosts', function(
	$templateCache, $state, $timeout,
	sharedData, linksParser,
	snapFeedAPI
) {
	return {
		restrict: 'E',
		scope: {
			posts: '=',
			newCommentText: '='
		},
		template: $templateCache.get('snap-posts.html'),
		replace: true,
		controller: function($scope) {

			$scope.model = {
				user: sharedData.get('user.sv')
			};



			$scope.submitNewComment = function(post) {
				var text = $scope.model.newCommentText;

				if (text) {
					var comment = {
						id: moment().format(),
						author: {
							color: null,
							full_name: null,
							id: null,
							last_name: null,
							photo: null,
							role: null
						},
						created_at: moment().format(),
						text: linksParser(text)
					};

					angular.forEach(comment.author, function(value, field) {
						comment.author[field] = $scope.model.user[field];
					});

					$timeout(function() {
						post.comments.push(comment);
					});

					snapFeedAPI.sendComment($state.params.snapId, post.author.id, text)
						.success(function(response) {
							comment.id = response.id;
							comment.created_at = response.created_at;
						})
						.error(function() {
							comment.tryAgain = true;
						});
				}
			};

		}
	};
});
