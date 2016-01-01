angular.module('HPApp').controller('PrivacyPolicyCtrl', function($scope, $translate) {

	$scope.templateUrl = '/_terms/privacy-policy_' + $translate.use() + '.html';

});
