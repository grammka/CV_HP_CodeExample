angular.module('HPApp').service('notifyErrors', function($filter) {
	return function(errors) {
		if (!errors.server_error) {
			if (typeof errors == 'object') {
				for(var field in errors) {
					var errorMessages = errors[field];

					if (typeof errorMessages == 'object') { // array
						var message = errorMessages.join('; ');
					} else if (typeof errorMessages == 'string') {
						message = errorMessages;
					}

					if (message.length < 200) {
						noty({
							text: message,
							type: 'error'
						});
					}
				}
			} else {
				noty({
					text: $filter('translate')('NOTIFICATIONS.OOPS_SMTH_GOES_WORNG') + ' ' + $filter('translate')('NOTIFICATIONS.TRY_AGAIN'),
					type: 'error'
				});
			}
		}
	}
});
