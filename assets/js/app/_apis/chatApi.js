angular.module('HPApp').factory('chatAPI', function($http, sharedData, apiRequest) {
	var API = {};


	API.getChats = function(params) {
		return apiRequest('chat', 'GET', params);
	};

	API.getNextChatsPage = function(url, params) {
		return $http.get(url, {params: params || {}});
	};

	API.createChat = function(userId, opponentId) {
		return apiRequest('chat', 'POST', {my_id: userId, opponent_id: opponentId})
			.success(function() {
				mixpanel.track('Chat opened');
			})
			.error(function(response, statusCode) {
				mixpanel.track('Error: Chat opened', {
					data: {userId: userId, opponentId: opponentId},
					statusCode: statusCode,
					response: response
				});
			});
	};

	API.getMessages = function(chatId) {
		return apiRequest('chat/' + chatId);
	};

	API.getPrevMessagesPage = function(url) {
		return $http.get(url);
	};

	API.sendMessage = function(chatId, message) {
		return apiRequest('chat/' + chatId, 'POST', {text: message});
	};

	API.removeChat = function(chatId) {
		return apiRequest('chat/' + chatId, 'DELETE');
	};


	return API;
});
