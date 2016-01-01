angular.module('HPApp')
	.factory('serverValidation', function() {
		return {
			errorClass: 't-validate-failed',
			cleanField: function($field) {
				if (!$field.hasClass(this.errorClass)) {
					$field = $field.closest('.' + this.errorClass);
				}

				if ($field.length) {
					$field.removeClass(this.errorClass);
					$field.removeAttr('n-tooltip n-tooltip-placement');
					$('.n-tooltip').remove();
				}
			}
		};
	})
	.directive('serverValidation', function($filter, serverValidation) {
		return {
			restrict: 'A',
			scope: {
				validationObject: '=serverValidation',
				methods: '='
			},
			controller: function($scope, $element, $attrs) {
				var errorClass = serverValidation.errorClass;

				function setErrors() {
					clearAllFields();

					if ($scope.validationObject && Object.keys($scope.validationObject).length) {
						angular.forEach($scope.validationObject, function(error, key) {
							setFieldError(key, error[0]);
						});

						var $elem = $element.find('.t-validate-failed')[0];

						if ($elem) {
							$element.parents('.nano-content').eq(0).animate({scrollTop: $elem.offsetTop - 50}, 300);
						}

						noty({
							text: $filter('translate')('NOTIFICATIONS.OOPS_SMTH_GOES_WORNG') + ' ' + $filter('translate')('NOTIFICATIONS.CHECK_FORM_FIELDS'),
							type: 'error'
						});
					}
				}

				function setFieldError(fieldName, message) {
					var $field = $element.find('[validate-field="' + fieldName + '"]');

					if ($field.length) {
						$field.addClass(errorClass);
						$field.attr({
							'n-tooltip': message,
							'n-tooltip-placement': 'top'
						});
					}
				}

				function clearField($field) {
					if (typeof $field !== 'object') {
						$field = $element.find('[validate-field="' + $field + '"]');
					}

					if ($field.length) {
						$field.removeClass(errorClass);
						$field.removeAttr('n-tooltip n-tooltip-placement');
						$('.n-tooltip').remove();
					}
				}

				function clearAllFields() {
					var $fields = $element.find('.' + errorClass);

					$fields.each(function(index, $el) {
						clearField($($el));
					});
				}


				if ($attrs.methods) {
					$scope.methods = {
						setFieldError: setFieldError,
						clearField: clearField,
						clearAllFields: clearAllFields
					};
				}



				$element.on('focus', ':input, [contenteditable]', function() {
					clearField($(this).parents('[validate-field]').eq(0));
				});


				$scope.$watch('validationObject', function() {
					setErrors();
				});

			}
		};
	});
