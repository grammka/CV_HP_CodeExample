angular.module('HPApp').factory('localization', function(
	$translate,
	localStorageService, amMoment, SmartPlurals
) {
	return {
		update: function(lang) {
			lang = lang || localStorageService.get('language');
	
			if (lang) {
				console.info('language updated to ' + lang);

				localStorageService.set('language', lang);
				$translate.use(lang);

				lang = lang == 'enUS' ? 'en' : 'ru';

				amMoment.changeLocale(lang);
				SmartPlurals.getRule(lang);
			} else {
				console.info('language updated to enUS');

				localStorageService.set('language', 'enUS');
				$translate.use('enUS');
				amMoment.changeLocale('en');
				SmartPlurals.setDefaultRule('en');
			}
		}
	};
});
