angular.module('HPApp').controller('ProfilePortfolioCtrl', function(
	$scope, $r, $stateParams,
	sharedData,
    user,
	ProfileFactory,
	usersAPI
) {

	var _FORM = {
		id: null,
		title: null,
		created: null,
		link: null,
		publisher: null
	};

	$scope.model = {
		currUserId: sharedData.get('user.sv.id'),
		user: user,
		articles: null,
		editing: false,
		editingArticleIndex: null,

		form: angular.copy(_FORM)
	};



	$scope.edit = function() {
		$scope.model.editing = true;
	};

	$scope.editStory = function(article, index) {
		angular.extend($scope.model.form, article);

		$scope.model.editingArticleIndex = index;
		$scope.model.editing = true;
	};
	
	$scope.cancel = function() {
		$scope.model.editing = false;
		$scope.model.form = angular.copy(_FORM);
	};

	$scope.save = function() {
		if ($scope.model.form.id) {
			usersAPI.updateArticle($stateParams.userId, $scope.model.form.id, $scope.model.form).success(function(article) {
				$scope.model.articles[$scope.model.editingArticleIndex] = article;
				$scope.cancel();
			});
		} else {
			usersAPI.createArticle($stateParams.userId, $scope.model.form).success(function(article) {
				$scope.model.articles.push(article);
				$scope.cancel();
			});
		}
	};

	$scope.upArticle = function(article, index) {
		$scope.model.articles[index] = $scope.model.articles[index - 1];
		$scope.model.articles[index - 1] = article;
	};

	$scope.downArticle = function(article, index) {
		if ($scope.model.articles[index + 1].is_favorite) {
			$scope.model.articles[index] = $scope.model.articles[index + 1];
			$scope.model.articles[index + 1] = article;
			$scope.downArticle(article, ++index);
		}
	};

	$scope.toggleArticleFavorite = function(article, index) {
		usersAPI.updateArticle($stateParams.userId, article.id, {is_favorite: !article.is_favorite}).success(function(_article) {
			article.is_favorite = _article.is_favorite;

			if (article.is_favorite) {
				while(index > 0) {
					$scope.upArticle(article, index--);
				}
			} else {
				$scope.downArticle(article, index);
			}
		});
	};

	$scope.removeArticle = function(articleId, index) {
		usersAPI.removeArticle($stateParams.userId, articleId).success(function() {
			$scope.model.articles.splice(index, 1);
		});
	};



	$r(ProfileFactory.getPortfolioData($scope.model.user.id))($scope, 'model.articles');

});
