angular.module('HPApp').controller('ProfileColleaguesCtrl', function(
	$scope, $r,
	sharedData,
	user,
	ProfileFactory,
	colleaguesAPI
) {

	$scope.model = {
		currUserId: sharedData.get('user.sv.id'),
		user: user,
		colleagues: null,
		suggestions: null
	};



	$scope.acceptColleagueRequest = function(user) {
		colleaguesAPI.acceptRequest(user.id).success(function() {
			user.is_confirmed = true;
		});
	};

	$scope.declineColleagueRequest = function(user, index) {
		colleaguesAPI.declineRequest(user.id).success(function() {
			$scope.model.colleagues.splice(index, 1);
		});
	};

	$scope.addColleague = function(user, index) {
		colleaguesAPI.sendRequest(user.id).success(function() {
			$scope.model.suggestions.splice(index, 1);
			noty({
				text: $filter('translate')('NOTIFICATIONS.REQUEST_SENT'),
				type: 'success'
			});
		});
	};

	$scope.hideColleague = function() {

	};



	$r(ProfileFactory.getColleaguesData($scope.model.user.id))($scope, 'model.colleagues');

	if ($scope.model.currUserId == $scope.model.user.id) {
		$r(ProfileFactory.getSuggestionsData())($scope, 'model.suggestions');
	}

});
