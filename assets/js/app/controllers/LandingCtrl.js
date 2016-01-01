angular.module('HPApp').controller('LandingCtrl', function(
	$scope, $translate,
	localization,
	mapData,
	snapFeedAPI
) {

	$scope.model = {
		snaps: null,
		mapData: mapData,
		//charsData: charsData,
		quotes: [
			{
				name: 'LANDING.WHAT_USERS_SAY.QUOTES.0.NAME',
				role: 'LANDING.WHAT_USERS_SAY.QUOTES.0.ROLE',
				link: 'https://twitter.com/ASLuhn',
				quote: 'LANDING.WHAT_USERS_SAY.QUOTES.0.TEXT'
			},
			{
				name: 'LANDING.WHAT_USERS_SAY.QUOTES.1.NAME',
				role: 'LANDING.WHAT_USERS_SAY.QUOTES.1.ROLE',
				link: 'https://www.linkedin.com/profile/view?id=AAIAAADT4lAB9XeZFWa-bt-zy8N2w6ZGtiF6C0c&trk',
				quote: 'LANDING.WHAT_USERS_SAY.QUOTES.1.TEXT'
			},
			{
				name: 'LANDING.WHAT_USERS_SAY.QUOTES.2.NAME',
				role: 'LANDING.WHAT_USERS_SAY.QUOTES.2.ROLE',
				link: 'https://twitter.com/igoroscope',
				quote: 'LANDING.WHAT_USERS_SAY.QUOTES.2.TEXT'
			}
		]
	};



	$scope.switchLanguage = function() {
		localization.update($translate.use() == 'ruRU' ? 'enUS' : 'ruRU');
	};



	snapFeedAPI.getOpenedSnaps().success(function(response) {
		$scope.model.snaps = response.results;
	});

});
