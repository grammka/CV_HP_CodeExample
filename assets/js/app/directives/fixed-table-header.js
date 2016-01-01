angular.module('HPApp').directive('fixedTableHeader', function($timeout) {
	return {
		restrict: 'A',
		scope: {
			rows: '='
		},
		link: function($scope, $element) {

			var $ths = $element.find('.fixed-table-header__header__item');

			function updateSize() {
				$timeout(function() {
					var $tr     = $element.find('tbody').find('tr:first'),
						$tds    = $tr.find('td');

					$ths.each(function(index) {
						$(this).css('width', $tds.eq(index).width());
					});
				});
			}

			$scope.$watch('rows', function(rowsCount) {
				if (rowsCount) {
					updateSize();
				}
			});

		}
	};
});
