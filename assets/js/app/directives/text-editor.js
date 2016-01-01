angular.module('HPApp').directive('textEditor', function(
	$timeout,
	avatar,
	utilsAPI, usersAPI
) {
	return {
		restrict: 'A',
		template: '<div contenteditable="true" />',
		replace: true,

		scope: {
			model: '=model',
			initValue: '@',
			initSelect: '=',
			submitOnEnter: '=',
			parseLinks: '=',
			opengraph: '=',
			methods: '=',
			onSubmit: '&?',
			onChange: '&'
		},

		link: function($scope, $element, $attrs) {

			var links = {},
				linksParser = new Autolinker.matchParser.MatchParser();



			function usersListTemplate(user) {
				var avatar  = avatar(user),
					name    = user.full_name || user.pseudonym,
					role    = user.role;

				avatar  = '<div class="atwho-view-user-item__avatar"><div class="sq-img">' + avatar + '</div></div>';
				name    = '<div class="atwho-view-user-item__name">' + name + '</div>';
				role    = role ? '<div class="atwho-view-user-item__role">' + role + '</div>' : '';

				return '<li><div class="atwho-view-user-item">' + avatar + name + role + '</div></li>';
			}

			function userLinkTemplate(user) {
				return '<span data-user-id="' + user.id + '">@' + user.full_name || user.pseudonym + '</span>';
			}

			function filterUserName(query, callback) {
				if (query.length > 2) {
					usersAPI.getByName(query).success(function(response) {
						callback(response);
					});
				} else {
					callback(null);
				}
			}





			var viewJustHid = false;
			function onUsersListHidden() {
				viewJustHid = true;
				setTimeout(function() {
					viewJustHid = false;
				}, 100);
			}

			function submit() {
				$scope.onSubmit();

				links = {};
				$element.blur();
				$element.html(null);
				$element.focus();
			}

			function checkSubmit(event) {
				if (typeof $scope.onSubmit == 'function') {
					if (event.which == 13 && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
						event.preventDefault();
						if (!viewJustHid) {
							submit();
						}
					}
				}
			}

			function replaceHtml(event) {
				if ((event.originalEvent || event).clipboardData) {
					var contentOnBlur = (event.originalEvent || event).clipboardData.getData('text/plain');

					if (contentOnBlur) {
						event.preventDefault();
						contentOnBlur = contentOnBlur.replace(/(<([^>]+)>)/ig, '');
						document.execCommand('insertText', false, contentOnBlur);
					}
				}
			}

			function parseLinks() {
				if ($scope.parseLinks && !$scope.opengraph) {
					var newLinks    = {},
						html        = $element.html();

					linksParser.replace(html, function(match) {
						if (match.url && !links[match.url]) {
							newLinks[match.url] = true;
						}
					});

					if (Object.keys(newLinks).length) {
						utilsAPI.getOpenGraph(newLinks).success(function(response) {
							$scope.opengraph = response;
						});

						angular.extend(links, newLinks);
					}
				}
			}

			function modelChanged(event) {
				$scope.$apply(function() {
					$scope.model = $element.html();
				});

				parseLinks();

				if (typeof $scope.onChange == 'function') {
					$scope.onChange(event);
				}
			}



			$element.atwho({
				at: "@",
				limit: 100,
				sorter: false,
				searchKey: 'full_name',
				displayTpl: usersListTemplate,
				insertTpl: userLinkTemplate,
				callbacks: {
					remoteFilter: filterUserName
				}
			});

			$element.on('hidden.atwho', onUsersListHidden);
			$element.on('keydown', checkSubmit);
			$element.on('paste', replaceHtml);
			$element.on('input', modelChanged);



			if ($scope.model) {
				var value;

				value = $scope.model;
				value = value.replace(/<a[^>]+?data-user-id-(\d+)\">([^<]+)<\/a>/g, '<span data-user-id="$1">$2</span>');
				value = stripScripts(value);

				$timeout(function() {
					$element.html(value);
				});
			}

			if ($scope.initSelect) {
				$timeout(function() {
					$element.selectText();
				});
			}

			if ($attrs.methods && $scope.methods) {
				$scope.methods.submit = submit;
			}

		}
	};
});
