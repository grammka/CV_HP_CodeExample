angular.module('HPApp').filter('formatChatTime', function($filter) {
	return function(value, format) {
		var valueMoment = moment(value);

		var diffs = {
			weeks:    moment().diff(valueMoment, 'weeks'),
			days:     moment().diff(valueMoment, 'days'),
			hours:    moment().diff(valueMoment, 'hours'),
			minutes:  moment().diff(valueMoment, 'minutes'),
			seconds:  moment().diff(valueMoment, 'seconds')
		};

		var timesEndings = {
			weeks:    ['weeks', 'weeks'],
			days:     ['day', 'days'],
			hours:    ['hr', 'hrs'],
			minutes:  ['min', 'mins'],
			seconds:  ['sec', 'secs']
		};

		function getLessThanDate(lessThan) {
			if (lessThan == 'weeks') {
				if (diffs.weeks <= 0) {
					return getLessThanDate('days');
				} else {
					return false;
				}
			} else if (lessThan == 'days') {
				if (diffs.days <= 0) {
					return getLessThanDate('hours');
				} else {
					return lessThan;
				}
			} else if (lessThan == 'hours') {
				if (diffs.hours <= 0) {
					return getLessThanDate('minutes');
				} else {
					return lessThan;
				}
			} else if (lessThan == 'minutes') {
				if (diffs.minutes <= 0) {
					return 'seconds';
				} else {
					return 'minutes';
				}
			}
		}

		var lessThan = getLessThanDate('weeks');

		if (!lessThan) {
			return valueMoment.format(format || 'DD MMM YYYY');
		} else if (lessThan == 'seconds') {
			return 'moments ago'
		} else {
			var numeralParams = timesEndings[lessThan];
			numeralParams.unshift(diffs[lessThan]);

			return diffs[lessThan] + ' ' + $filter('plural').apply(null, numeralParams) + ' ago';
		}

	};
});
