angular.module('HPApp').directive('gridGallery', function() {
	return {
		restrict: 'E',
		template: '<div class="grid-gallery" />',
		replace: true,

		scope: {
			images: '='
		},

		link: function($scope, $element) {

			var lightboxId = +new Date();

			function initMosaic() {
				var imagesHtml = '';

				angular.forEach($scope.images, function(img) {
					imagesHtml += '\
						<a \
							href="' + img.photo + '"\
							class="grid-gallery__item"\
							data-lightbox="image-' + lightboxId + '" \
							style="width: ' + img.thumb_width + 'px; height: ' + img.thumb_height + 'px; background-image: url(' + img.thumb + ')"\
						></a>\
					';
				});

				$element.html(imagesHtml).hide();

				$element.show().jMosaic({
					items_type: 'a',
					min_row_height: 120,
					margin: 3
				});
			}

			function loadSoloImage() {
				var img     = $scope.images[0],
					$item   = $('<a href="' + img.photo + '" data-lightbox="image-' + lightboxId + '" class="grid-gallery__solo-item" style="background-image: url(' + img.thumb + ')"></div>'),
					visibleHeight = $element.width() / img.thumb_width * img.thumb_height;

				$item.height(visibleHeight > 400 ? 400 : visibleHeight);
				$element.html($item);
			}

			if ($scope.images.length == 1) {
				loadSoloImage();
			} else {
				initMosaic();
			}

		}
	};
});
