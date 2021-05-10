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
			
			/** @type {Function} */
			var entryStyleClassFunction = null;
			$scope.$watch("model.entryStyleClassFunction", function(newValue, oldValue) {
				if ($scope.model.entryStyleClassFunction) {
					entryStyleClassFunction = eval('(' + $scope.model.entryStyleClassFunction + ')');
				}
			});

			$scope.getEntryStyleClass = function(entry) {
				var index = $scope.model.data.indexOf(entry);
				var result = '';
				if (entryStyleClassFunction) {
					result = entryStyleClassFunction(entry);
				}
				if ($scope.model.selectionClass && $scope.model.selectedIndex === index) {
					result += ' ' + $scope.model.selectionClass;
				}
				return result;
			}

			/** @type {Function} */
			var entryRendererFunction = function(entry, index) {
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

			$scope.getEntryRenderer = function(entry, index) {
				if (entryRendererFunction) {
					return entryRendererFunction(entry, index);
				}
				return '';
			}
			
			$scope.tooltipFunction = function() {
				return null
			};
			$scope.$watch("model.tooltipFunction", function(newValue, oldValue) {
				if ($scope.model.tooltipFunction) {
					$scope.tooltipFunction = eval('(' + $scope.model.tooltipFunction + ')');
				}
			});	
			
	        $scope.isTrustedHTML = function() {
	            if($scope.svyServoyapi.trustAsHtml() || $scope.model.showAs === 'trusted_html') {
	                return true;
	            }
	            return false;
	        }
			
	        $scope.getSanitizedData = function(entry) {
				// return it as is
				if ($scope.isTrustedHTML()) {
					// avoid cycling the object if trusted
					return entry;
				}
				
				var data = {};
				if ((typeof entry) === 'string') {
					// if is a string sanitize the string
					if ($scope.isTrustedHTML()) {
						data = $sce.trustAsHtml(entry);
					} else {
						data = $sce.getTrustedHtml(entry);
					}
				} else if ((typeof entry) === 'object' || entry instanceof Array) {
					// sanitize items of entry
					for (var dp in entry) {
						var entryValue = entry[dp];
						if (entryValue === null || entryValue === undefined) {
							data[dp] = entryValue;
						} else if (entryValue instanceof Array) {
							// handle arrays
							for (var i in entryValue) {
								entryValue[i] = $scope.getSanitizedData(entryValue[i]);
							}
							data[dp] = entryValue;
						} else if ((typeof entryValue) === 'object') {
							// nested object
							entryValue = $scope.getSanitizedData(entryValue);
							data[dp] = entryValue;
						} else if ((typeof entryValue) === 'string' && !$scope.isTrustedHTML()) {
							data[dp] = $sce.getTrustedHtml(entryValue);
						} else if ((typeof entryValue) === 'string') {
							data[dp] = $sce.trustAsHtml(entryValue);
						} else {
							data[dp] = entryValue;
						}
					}			
				} else {
					// if is a number or boolean
					data = entry;
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
						if ($scope.model.responsiveHeight > 0) {
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
			
			if ($scope.handlers.onSortEnd || $scope.model.sortableOptions) {
				var sortOptions = $scope.model.sortableOptions || {};
				if ($scope.handlers.onSortEnd) {
					sortOptions.onEnd = onSortEnd;
				}
				Sortable.create($element.find('.svy-extra-listcomponent')[0], sortOptions);
			}
			
			function onSortEnd(evt) {
				var evtOldIndices = (evt.oldIndicies.length ? evt.oldIndicies : null) || [{index: evt.oldIndex}];
				var evtNewIndices = (evt.newIndicies.length ? evt.newIndicies : null) || [{index: evt.newIndex}];
				var oldIndicies = [];
				var newIndicies = [];
				var oldEntries = [];
				var newEntries = [];
				
				/** @type {Array} */
				var originalArray = $scope.model.data.concat([]);
				
				for (var o = 0; o < evtOldIndices.length; o++) {					
					var oldItem = originalArray[evtOldIndices[o].index];
					var newItem = originalArray[evt.newIndex];
					
					//reorder the data
					$scope.model.data.splice(originalArray.indexOf(oldItem), 1);
					$scope.model.data.splice(originalArray.indexOf(newItem), 0, oldItem);
					
					oldIndicies.push(evtOldIndices[o].index);
					newIndicies.push(evtNewIndices[o].index);
					newEntries.push(newItem);
					oldEntries.push(oldItem);
				}
				
				$scope.svyServoyapi.apply('data');
				$scope.handlers.onSortEnd(evt, oldIndicies, newIndicies, oldEntries, newEntries);
			}

		},
      templateUrl: 'customrenderedcomponents/customlist/customlist.html'
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