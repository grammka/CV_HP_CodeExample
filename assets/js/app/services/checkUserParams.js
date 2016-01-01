angular.module('HPApp').factory('checkUserParams', function(sharedData) {
	return {
		isRoleAndEmailExist: function() {
			return sharedData.get('user.sv.role') && sharedData.get('user.sv.email');
		},
		isEmailConfirmed: function() {
			return sharedData.get('user.sv.is_email_confirmed');
		},
		isTermsConfirmed: function() {
			return sharedData.get('user.sv.is_terms_confirmed');
		}
	};
});
