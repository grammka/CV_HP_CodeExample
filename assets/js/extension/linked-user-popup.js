$(function() {

	function createLinkedUser(data) {
		var $result = $('<div class="linked-user"></div>');

		$result.append('<div class="linked-user__photo"><div class="sq-img">' + getUserAvatar(data) + '</div></div>');
		$result.append('<a href="/profile/' + data.id + '" class="linked-user__name">' + data.full_name || data.pseudonym + '</a>');
		$result.append('<div class="linked-user__role">' + data.role + '</div>');
		$result.append('<a href="/messenger/' + SharedData.user.sv.id + '/' + data.id +'" class="btn btn_24 btn_dark-blue linked-user__send-mess-btn">Send message</a>');

		return $result;
	}

	$(document).on('mouseenter', '.atwho-inserted', function() {
		var self = this;

		if ($(self).find('a').length) {
			self.timer = setTimeout(function() {
				var $scope, userId, linkedUserData;

				$scope = angular.element(self).scope().$parent;
				$scope = $scope.comment || $scope.post;
				userId = +($(self).find('a').attr('href').replace('/profile/', ''));

				if ($scope.linked_users && $scope.linked_users[userId]) {
					linkedUserData  = $scope.linked_users[userId];

					self.$linkedUser = createLinkedUser(linkedUserData);

					$(self).append(self.$linkedUser);
				}
			}, 300);
		}
	});

	$(document).on('mouseleave', '.atwho-inserted', function() {
		clearTimeout(this.timer);
		this.timer = null;

		if (this.$linkedUser) {
			this.$linkedUser.remove();
		}
	});

});
