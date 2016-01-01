angular.module('HPApp').factory('snapFeedOptions', function(
	$q,
	snapFeedAPI
) {

	var SnapFeedOptions = {};


	SnapFeedOptions.data = null;

	SnapFeedOptions.checkLoaded = function() {
		return !!Object.keys(this.data).length;
	};

	SnapFeedOptions.load = function(force) {
		var self = this,
			deferred = $q.defer();

		if (this.data && !force) {
			deferred.resolve(this.data);
		} else {
			console.info('snapFeed options are loading');

			snapFeedAPI.getOptions().success(function(options) {
				console.info('snapFeed options loaded');

				self.data = options;
				deferred.resolve(options);
			});
		}

		return deferred.promise;
	};

	SnapFeedOptions.get = function(key) {
		return this.data[key];
	};

	SnapFeedOptions.getSelectOptions = function(key) {
		if (this.data[key]) {
			return this.data[key].map(function(label) {
				return {value: label, label: label};
			});
		}
	};

	SnapFeedOptions.getCreateCategoriesSelectOptions = function() {
		return this.data.create_categories.map(function(obj) {
			return {value: obj.name, label: obj.name, type: obj.snap_type};
		});
	};

	SnapFeedOptions.getRewardCurrenciesSelectOptions = function() {
		return this.data.reward_currency.map(function(obj) {
			return {value: obj.name, label: obj.symbol};
		});
	};

	SnapFeedOptions.getTags = function(tags) {
		var result = {};

		(tags || this.data.tags).forEach(function(tagName) {
			result[tagName] = {
				title: tagName
			};
		});

		return result;
	};


	return SnapFeedOptions;

});
