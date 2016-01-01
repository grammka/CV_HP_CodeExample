function getAvatar(data) {
	var html;

	if (data) {
		if (data.photo && data.photo != 'private') {
			html = '<img class="avatar" src="' + data.photo + '">';
		} else {
			var firstLetter = (data.first_name || data.last_name || data.full_name || data.name || data.pseudonym || 'H')[0].toLowerCase(),
				bgColor = '', classColor = '';

			if (data.color) {
				bgColor = ' style="background: #' + data.color + ';"';
			} else {
				classColor = ' color-avatar-color-' + (data.photo == 'private' ? 0 : 44);
			}

			html = '<div class="avatar color-avatar' + classColor + '"' + bgColor + '>' + firstLetter + '</div>';
		}
	}

	return html;
}

angular.module('HPApp').service('avatar', function() {
	return function(data) {
		return getAvatar(data);
	};
});
