angular.module('HPApp').controller('SnapFeedSnapCtrl', function(
	$scope, $stateParams, $state,
	sharedData, linksParser,
	snapFeedAPI
) {

	$scope.model = {
		user: sharedData.get('user.sv'),
		snap: null,
		messages: null,

		newMessageForm: {
			text: null
		},
		newCommentForm: {
			text: null
		}
	};



	var submitNewMessageRequesting = false;
	$scope.submitNewMessage = function() {
		var text = $scope.model.newMessageForm.text;

		if (!submitNewMessageRequesting && text) {
			submitNewMessageRequesting = true;

			snapFeedAPI.sendMessage($stateParams.snapId, linksParser(text))
				.success(function(message) {
					$scope.model.messages.unshift(message);
					$scope.model.newMessageForm.text = null;
					submitNewMessageRequesting = false;
				})
				.error(function() {
					submitNewMessageRequesting = false;
				});
		}
	};

	var submitNewCommentRequesting = false;
	$scope.submitNewComment = function() {
		var text = $scope.model.newCommentForm.text;

		if (!submitNewCommentRequesting) {
			if ($scope.model.user.is_confirmed && text) {
				submitNewCommentRequesting = true;

				text = linksParser(text);

				snapFeedAPI.sendComment($stateParams.snapId, text, message.author.id)
					.success(function(comment) {
						message.comments.push(comment);
						$scope.model.newCommentForm.text = null;
						submitNewCommentRequesting = false;
					})
					.error(function() {
						submitNewCommentRequesting = false;
					});
			}
		}
	};



	snapFeedAPI.getSnap($stateParams.snapId).success(function(snap) {
		$scope.model.snap = snap;

		var messages = {};

		if ($scope.model.user.id == snap.author.id) {
			angular.forEach(snap.comments, function(snapComment, index) {
				if (!messages[snapComment.author.id] && !snapComment.target) {
					messages[snapComment.author.id] = snapComment;
					messages[snapComment.author.id].comments = [];
					messages[snapComment.author.id].index = index;
				}
			});

			angular.forEach(snap.comments, function(snapComment, index) {
				if (snapComment.target && messages[snapComment.target]) {
					messages[snapComment.target].comments.push(snapComment);
				}

				if (messages[snapComment.author.id] && messages[snapComment.author.id].index != index) {
					messages[snapComment.author.id].comments.push(snapComment);
				}
			});
		} else {
			messages = snap.comments;
		}

		$scope.model.messages = messages;
	});

});
