angular.module('HPApp').controller('MessengerCtrl', function(
	$rootScope, $scope, $timeout, $location, $state, $translate,
	localStorageService, ngDialog, sharedData, linksParser,
	chatAPI, profileSharesAPI, profileIgnoreAPI
) {

	$scope.model = {
		user: sharedData.get('user.sv'),
		currUserId: $state.params.userId,
		messagesBaron: null,
		chats: null,
		nextChatsUrl: null,
		currChat: null,
		messages: null,
		prevMessagesUrl: null,
		messagesMethods: {},
		newMessageText: null,
		newMessageHeight: 20
	};



	function scrollMessagesToEnd() {
		$timeout(function() {
			$scope.model.messagesMethods.update();
			$scope.model.messagesMethods.scrollBottom();
		});
	}

	function loadMessages(chat) {
		chatAPI.getMessages(chat.id).success(function(response) {
			angular.forEach(response.results, function(message) {
				message.text = message.text.replace('&nbsp;', ' ');
			});

			$scope.model.messages = response.results;
			$scope.model.prevMessagesUrl = response.next;

			scrollMessagesToEnd();

			var userId      = chat.to_profile && chat.to_profile.id ? chat.to_profile.id : $scope.model.user.id,
				opponentId  = chat.from_profile.id;

			$scope.model.currUserId = userId;
			$state.go('ws.messenger.opponent', {userId: userId, opponentId: opponentId}, {notify:false, reload:true});
		});
	}

	var loadingNextChatsPageUrl;
	$scope.loadNextChatsPage = function() {
		if ($scope.model.nextChatsUrl && $scope.model.nextChatsUrl != loadingNextChatsPageUrl) {
			loadingNextChatsPageUrl = $scope.model.nextChatsUrl;
			chatAPI.getNextChatsPage(loadingNextChatsPageUrl, {items_per_page: 20}).success(function(response) {
				var chats = angular.copy($scope.model.chats);

				angular.forEach(response.results, function(chat) {
					chat._updated_date = +new Date(chat.updated_at);
					chats[chat.id] = chat;
				});

				$scope.model.chats = chats;
				$scope.model.nextChatsUrl = response.next;
			});
		}
	};

	var loadPrevMessagesPageRequesting = false;
	$scope.loadPrevMessagesPage = function() {
		if (!loadPrevMessagesPageRequesting && $scope.model.prevMessagesUrl) {
			loadPrevMessagesPageRequesting = true;

			chatAPI.getPrevMessagesPage($scope.model.prevMessagesUrl)
				.success(function(response) {
					var messagesScrollParams = $scope.model.messagesMethods.getCurrParams();

					angular.forEach(response.results, function(message) {
						message.text = message.text.replace('&nbsp;', ' ');
					});

					$scope.model.messages = response.results.concat($scope.model.messages);
					$scope.model.prevMessagesUrl = response.next;

					$scope.model.messagesMethods.update();

					loadPrevMessagesPageRequesting = false;

					$timeout(function() {
						var newMessagesScrollParams = $scope.model.messagesMethods.getCurrParams(),
							newScrollTop = newMessagesScrollParams.height - messagesScrollParams.height + messagesScrollParams.scrollTop;

						$scope.model.messagesMethods.scrollTop(newScrollTop);
					});
				})
				.error(function() {
					loadPrevMessagesPageRequesting = false;
				});
		}
	};

	$scope.getChat = function(userId, opponentId) {
		chatAPI.createChat(userId, opponentId).success(function(chat) {
			if (!$scope.model.chats[chat.id]) {
				chat._updated_date = +new Date(chat.updated_at);
				$scope.model.chats[chat.id] = chat;
			}
			$scope.openChat(chat);
		});
	};

	$scope.openChat = function(chat) {
		$scope.model.currChat = chat;

		if (chat.new_messages) {
			$rootScope.$emit('Messenger.openChat.clearUnread', chat.new_messages);
			chat.new_messages = 0;
		}

		loadMessages(chat);
	};

	$scope.removeChat = function(chatId) {
		chatAPI.removeChat(chatId).success(function() {
			if (chatId == $scope.model.currChat.id) {
				$scope.model.currChat = null;
				$scope.model.messages = null;
				$scope.model.messagesBaron = null;
			}
			delete $scope.model.chats[chatId];
		});
	};

	$scope.newMessageFormChanged = function() {
		$timeout(function() {
			var newMessageFormHeight = $('#messengerNewMessage').height();

			if (newMessageFormHeight != $scope.model.newMessageHeight) {
				var messagesScrollParams = $scope.model.messagesMethods.getCurrParams(),
					newScrollTop = messagesScrollParams.scrollTop - $scope.model.newMessageHeight + newMessageFormHeight;

				$scope.model.newMessageHeight = newMessageFormHeight;
				$scope.model.messagesMethods.scrollTop(newScrollTop);
			}
		});
	};

	var sendMessageRequesting = false;
	$scope.sendMessage = function() {
		var text = $scope.model.newMessageText.replace('<div><br></div>', '');

		if (!sendMessageRequesting) {
			if ($scope.model.currChat && text) {
				sendMessageRequesting = true;

				text = linksParser(text);

				chatAPI.sendMessage($scope.model.currChat.id, text)
					.success(function(message) {
						sendMessageRequesting = false;
						if (!$scope.model.messages) {
							$scope.model.messages = [];
						}
						$scope.model.messages.push(message);
						$scope.newMessageFormChanged();
						scrollMessagesToEnd();
					})
					.error(function(response) {
						sendMessageRequesting = false;
						noty({
							text: response.non_field_errors[0],
							type: 'error'
						});
					});
			}
		}
	};

	// Ignore user ----------------------------------------------------------------------- /

	$scope.addToIgnore = function() {
		profileIgnoreAPI.ignore($state.params.opponentId).success(function() {
			$scope.model.currChat.from_profile.is_ignored = true;
		});
	};

	$scope.stopIgnoring = function() {
		profileIgnoreAPI.stopIgnoring($state.params.opponentId).success(function() {
			$scope.model.currChat.from_profile.is_ignored = false;
		});
	};

	// Share private info ---------------------------------------------------------------- /

	$scope.sharePrivateInfo = function() {
		profileSharesAPI.share($state.params.opponentId).success(function() {
			$scope.model.currChat.from_profile.is_my_profile_shared = true;
		});
	};

	$scope.stopSharingPrivateInfo = function() {
		profileSharesAPI.stopSharing($state.params.opponentId).success(function() {
			$scope.model.currChat.from_profile.is_my_profile_shared = false;
		});
	};



	$scope.$on('WS.Messenger.update', function(event, message) {
		if ($state.params.opponentId && $state.params.opponentId == message.author.id) {
			$scope.model.messages.push(message);
			scrollMessagesToEnd();
		} else {
			$scope.model.chats[message.target].new_messages++;
		}
	});

			

	chatAPI.getChats({owner_id: $state.params.userId, items_per_page: 20}).success(function(response) {
		var _chats = {};

		angular.forEach(response.results, function(chat) {
			chat._updated_date = +new Date(chat.updated_at);
			_chats[chat.id] = chat;
		});

		$scope.model.chats = _chats;
		$scope.model.nextChatsUrl = response.next;

		if ($state.params.opponentId) {
			$scope.getChat($state.params.userId, $state.params.opponentId);
		}
	});

});
