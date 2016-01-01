angular.module('HPApp').controller('TermsOfUseCtrl', function($scope, $translate) {

	$scope.templateUrl = '/_terms/terms-of-use_' + $translate.use() + '.html';

});
