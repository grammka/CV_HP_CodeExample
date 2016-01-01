angular.module('braintree', [])

	.factory('braintreeSrvs', function(paymentAPI) {
		var Braintree = {};
		var checkout, token;

		Braintree.setToken = function() {
			paymentAPI.getToken().success(function(response) {
				token = response;
				Braintree.setup(response);
			});
		};

		Braintree.getToken = function() {
			return token;
		};

		Braintree.setup = function(token) {
			braintree.setup(token, 'custom', {
				onReady: function (integration) {
					checkout = integration;
				},
				onPaymentMethodReceived: function (payload) {
					// retrieve nonce from payload.nonce
				},
				paypal: {
					singleUse: true,
					amount: 10.00,
					currency: 'USD',
					locale: 'en_us',
					enableShippingAddress: 'true',
					headless: true
				}
			});
		};

		return Braintree;
	})

	.directive('braintreeDir', function(braintreeSrvs) {
		return {
			restrict: 'E',
			template: '<form id="checkout" method="post" action="/checkout">\n  <div id="payment-form"></div>\n  <input type="submit" value="Pay $10">\n</form>',
			replace: true,

			link: function($scope, $element, $attrs) {

				braintree.setup(braintreeSrvs.getToken(), "dropin", {
					container: "payment-form"
				});

			}
		};
	});
