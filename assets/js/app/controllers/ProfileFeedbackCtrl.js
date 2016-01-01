angular.module('HPApp').controller('ProfileFeedbackCtrl', function(
	$scope, $r, $stateParams,
	sharedData, methods,
	user, feedbackOptions,
	ProfileFactory,
	feedbackAPI
) {

	var categories = angular.copy(feedbackOptions.categories);

	$scope.model = {
		currUserId: sharedData.get('user.sv.id'),
		currUser: sharedData.get('user.sv'),
		user: user,
		posts: null,

		ratingsSelectOptions: methods.generateSelectizeOptions([1,2,3,4,5,6,7,8,9,10]),
		categories: angular.copy(categories),

		activeCategory: null,
		editing: false,
		editingPostIndex: null,
		validateObject: null,
		validateMethods: null
	};



	$scope.selectCategory = function(item) {
		$scope.model.activeCategory = item;
	};



	$scope.edit = function() {
		$scope.model.editing = true;
	};

	$scope.cancel = function() {
		$scope.model.editing = false;
		$scope.model.validateObject = null;
		$scope.model.categories = angular.copy(categories);
	};

	$scope.submitFeedback = function() {
		var data = $scope.model.categories.filter(function(item) {
			return item.rating > 0;
		});

		angular.forEach(data, function(item, index) {
			data[index] = {
				category_id: item.id,
				rating: item.rating,
				comment: item.comment
			};
		});

		if (data.length) {
			if (!data.every(function(item) {
				return !!item.comment && item.comment.length;
			})) {
				return noty({
					text: "You must give both comments and ratings for a category",
					type: 'error'
				});
			}

			feedbackAPI.post($stateParams.userId, data)
				.success(function(posts) {
					angular.forEach(posts, function(post) {
						$scope.model.posts.push(post);
					});

					feedbackAPI.getOptions($stateParams.userId).success(function(options) {
						categories = options.categories;
						$scope.cancel();
					});
				})
				.error(function(response) {
					$scope.model.validateObject = response;
				});
		}
	};



	$r(ProfileFactory.getFeedbackData($scope.model.user.id))($scope, 'model.posts');

});
