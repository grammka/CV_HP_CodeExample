angular.module('HPApp').directive('landingMap', function() {
	return {
		restrict: 'AE',
		scope: {
			data: '='
		},
		link: function($scope) {

			var map = L.mapbox.map('landingMap', 'grammka.a9048d2b').setView([35, 20], 2);

			map.scrollWheelZoom.disable();

			angular.forEach($scope.data, function(item) {
				var icon = L.divIcon({
					className: '',
					html: '<div class="dot" data-name="' + item.data.name + '" data-coo="' + item.coords[0] + ',' + item.coords[1] + '"></div>'
				});

				L.marker(new L.LatLng(item.coords[0], item.coords[1]), {icon: icon}).addTo(map);
			});

		}
	};
});
