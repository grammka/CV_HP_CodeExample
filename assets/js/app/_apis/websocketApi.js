angular.module('HPApp').factory('websocketAPI', function($rootScope) {
	var API = {
		_url: null,
		_socket: null
	};

	API.init = function() {
		API._url = $rootScope.wsPath;

		if (!window.WebSocket) {
			alert('WebSockets not working in this browser!');
		} else {
			if (!API._socket) {
				API._socket = new WebSocket(API._url);

				API._socket.onmessage = function(event) {
					return $rootScope.$broadcast('WS.Messenger.update', JSON.parse(event.data));
				};

				console.info('WebSockets started');
			}
		}
	};


	return API;
});
