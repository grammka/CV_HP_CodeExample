angular.module('confirmDialog', []);

angular.module('confirmDialog')
	.directive('confirmClick', function(confirmClickDialog) {
		return {
			restrict: 'A',
			link: function($scope, $element, $attrs) {
				$element.on('click', function() {
					if (!$attrs.disabled) {
						confirmClickDialog(null, $attrs.confirmTitle, $attrs.confirmButtonText, $attrs.cancelButtonText)
							.then(function(response) {
								if (response.value === true) {
									$scope.$eval($attrs.confirmClick);
								}
							});
					}
				});

			}
		}
	})
	.service('confirmClickDialog', function($filter, ngDialog) {
		return function(message, title, confirmButton, cancelButton) {
			title           = title || $filter('translate')('DIALOGS.CONFIRM.TITLE');
			confirmButton   = confirmButton || $filter('translate')('DIALOGS.CONFIRM.CONFIRM_BUTTON');
			cancelButton    = cancelButton || $filter('translate')('DIALOGS.CONFIRM.DECLINE_BUTTON');

			var ModalInstanceCtrl = function($scope) {
				$scope.confirm = function() {
					$scope.closeThisDialog(true);
				};

				$scope.cancel = function() {
					$scope.closeThisDialog();
				};
			};

			var dialog = ngDialog.open({
				className: 'ngdialog-theme-default modal_confirm-click',
				controller: ModalInstanceCtrl,
				template: '\
					<div class="dialog-modal"> \
						<div class="ngdialog__title">{{ ngDialogData.modalTitle }}</div> \
						<div class="modal-body">\
							{{ ngDialogData.modalBody }}\
							<div class="btns t-text_center">\
								<div class="btn btn_40 btn_red t-w100" ng-click="confirm()">{{ ngDialogData.confirmButton }}</div>\
								<div class="btn btn_40 btn_green t-w100" ng-click="cancel()">{{ ngDialogData.cancelButton }}</div>\
							</div>\
						</div> \
					</div>\
                ',
				disableAnimation: true,
				plain: true,
				appendTo: 'body',
				data: {
					modalTitle: title,
					modalBody: message,
					confirmButton: confirmButton,
					cancelButton: cancelButton
				}
			});

			return dialog.closePromise;
		}
	});
