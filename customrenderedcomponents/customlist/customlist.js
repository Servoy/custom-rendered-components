angular.module('customrenderedcomponentsCustomlist',['servoy'])
.directive('customrenderedcomponentsCustomlist', ['$log', '$foundsetTypeConstants', '$sce', function($log, $foundsetTypeConstants, $sce) {
	return {
		restrict: 'E',
		scope: {
			model: '=svyModel',
			handlers: '=svyHandlers',
			api: '=svyApi',
			svyServoyapi: '='
		},
		controller: function($scope, $element, $attrs) {

			$scope.getEntryStyleClass = function(entry) {
				var index = $scope.model.data.indexOf(entry);
				var result = '';
				if ($scope.model.selectionClass && $scope.model.selectedIndex === index) {
					result += $scope.model.selectionClass;
				}
				return result;
			}

			/** @type {Function} */
			var entryRendererFunction = function(entry) {
				var template = '<div>';
				for (var prop in entry) {
					if (prop !== '$$hashKey') {
						template += '<div data-target="' + prop + '" ng-bind-html="entry.' + prop + '"></div>';
					}
				}
				template += '</div>';
				return template;
			}

			$scope.$watch("model.entryRendererFunction", function(newValue, oldValue) {
				if ($scope.model.entryRendererFunction) {
					entryRendererFunction = eval('(' + $scope.model.entryRendererFunction + ')');
				}
			});

			$scope.getEntryRenderer = function(entry) {
				if (entryRendererFunction) {
					return entryRendererFunction(entry);
				}
				return '';
			}
			
			$scope.getSanitizedData = function(entry) {
				var data = {};
				for (var dp in entry) {
					var entryValue = entry[dp];
					if ((typeof entryValue) === 'object') {
						for (var i in entryValue) {
							entryValue[i] = $scope.getSanitizedData(entryValue[i]);
						}
					} else if ((typeof entryValue) === 'string' && !$scope.svyServoyapi.trustAsHtml()) {
						data[dp] = $sce.getTrustedHtml(entryValue);
					} else if ((typeof entryValue) === 'string') {
						//allow html content
						data[dp] = $sce.trustAsHtml(entryValue);
					} else {
						data[dp] = entryValue;
					}
				}
				return data;
			}

			$scope.onEntryClick = function(entry, index, event) {
				$scope.model.selectedIndex = index;
				if ($scope.handlers.onClick) {
					var target = event.target;
					var dataTarget = $(target).closest("[data-target]");
					var data;
					if (dataTarget && dataTarget[0]) {
						data = dataTarget[0].getAttribute("data-target");
					}
					$scope.handlers.onClick(entry, index, data, event);
				}
			}
			
			/**
			 * Adds the given style class to all items in the list's children that match the selector.
			 * Note that tag selectors are not supported.
			 *
			 * @param {String} selector
			 * @param {String} styleClass
			 */
			$scope.api.addStyleClassForSelector = function(selector, styleClass) {
				$element.find(selector).addClass(styleClass);
			}

			/**
			 * Removes the given style class from all items in the list's children that match the selector.
			 * Note that tag selectors are not supported.
			 *
			 * @param {String} selector
			 * @param {String} styleClass
			 */
			$scope.api.removeStyleClassForSelector = function(selector, styleClass) {
				$element.find(selector).removeClass(styleClass);
			}

			$scope.getLayoutStyle = function() {
				var layoutStyle = { };
				if ($scope.$parent.absoluteLayout) {
				} else {
					layoutStyle.position = "relative";
					if ($scope.model.responsiveDynamicHeight) {
						var h = 0;
						$element.find("div.list-item").each(function() {
							h += $(this).height();
							if (h > $scope.model.responsiveHeight) {
								return false;
							}
						});
						if ($scope.model.responsiveHeight === 0) {
							$element.css("height", "100%");
							layoutStyle.height = 100 + "%";
						} else {
							layoutStyle.height = h + "px";
							layoutStyle.maxHeight = $scope.model.responsiveHeight + "px";
						}
					} else {
						if ($scope.model.responsiveHeight === 0) {
							$element.css("height", "100%");
							layoutStyle.height = 100 + "%";
						} else {
							layoutStyle.height = $scope.model.responsiveHeight + "px";
						}
					}
				}
				return layoutStyle;
			}

		},
      templateUrl: 'customrenderedcomponents/listcomponent/listcomponent.html'
    };
  }]).directive('bindListHtmlCompile', ['$compile', function($compile) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				scope.$watch(function() {
						return scope.$eval(attrs.bindListHtmlCompile);
					}, function(value) {
						// Incase value is a TrustedValueHolderType, sometimes it
						// needs to be explicitly called into a string in order to
						// get the HTML string.
						element.html(value && value.toString());
						// If scope is provided use it, otherwise use parent scope
						var compileScope = scope;
						if (attrs.bindListHtmlScope) {
							compileScope = scope.$eval(attrs.bindListHtmlScope);
						}
						$compile(element.contents())(compileScope);
					});
			}
		};
	}]);