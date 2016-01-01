angular.module('HPApp').controller('DialogFeedbackCtrl', function(
	$scope, $filter,
	apiRequest
) {

	$scope.model = {
		categories: [
			{label: 'DIALOGS.FEEDBACK.FORM.SELECT_OPTIONS.BUG',              value: 'bug'},
			{label: 'DIALOGS.FEEDBACK.FORM.SELECT_OPTIONS.RANDOM_THOUGHTS',  value: 'random thoughts'},
			{label: 'DIALOGS.FEEDBACK.FORM.SELECT_OPTIONS.FUNC_DISLIKES',    value: 'functionality dislikes'},
			{label: 'DIALOGS.FEEDBACK.FORM.SELECT_OPTIONS.FUNC_LIKES',       value: 'functionality likes'},
			{label: 'DIALOGS.FEEDBACK.FORM.SELECT_OPTIONS.FUNC_WISHLIST',    value: 'functionality wishlist'},
			{label: 'DIALOGS.FEEDBACK.FORM.SELECT_OPTIONS.DESIGN_DISLIKE',   value: 'design dislike'},
			{label: 'DIALOGS.FEEDBACK.FORM.SELECT_OPTIONS.DESIGN_LIKE',      value: 'design like'},
			{label: 'DIALOGS.FEEDBACK.FORM.SELECT_OPTIONS.DESIGN_WISHLIS',   value: 'design wishlist'}
		],
		form: {
			text: null,
			category: null
		}
	};



	$scope.submitFeedback = function() {
		apiRequest('feedback', 'POST', $scope.model.form).success(function() {
			$scope.closeThisDialog();
			noty({
				text: $filter('translate')('NOTIFICATIONS.FEEDBACK_SENT.SUCCESS'),
				type: 'success'
			});
		});
	};

});
