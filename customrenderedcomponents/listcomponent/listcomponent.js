angular.module('customrenderedcomponentsListcomponent',['servoy'])
.directive('customrenderedcomponentsListcomponent', ['$log', '$foundsetTypeConstants', '$sce', function($log, $foundsetTypeConstants, $sce) {
	return {
		restrict: 'E',
		scope: {
			model: '=svyModel',
			handlers: '=svyHandlers',
			api: '=svyApi',
			svyServoyapi: '='
		},
		controller: function($scope, $element, $attrs) {

			var elementList = $element.find('.svy-extra-listcomponent');
			
			if ($scope.model.entryRendererFunc) {
				$scope.model.entryRendererFunction = $scope.model.entryRendererFunc;
			}

			if ($scope.svyServoyapi.isInDesigner()) {
				$scope.model.data = [{ dp0: "dp0", dp1: "dp1" }];
			}

			/** @type {Function} */
			var entryStyleClassFunction = null;
			$scope.$watch("model.entryStyleClassFunc", function(newValue, oldValue) {
				if ($scope.model.entryStyleClassFunc) {
					entryStyleClassFunction = eval('(' + $scope.model.entryStyleClassFunc + ')');
				}
			});
			
			$scope.$watch("model.entryStyleClassFunction", function(newValue, oldValue) {
				if ($scope.model.entryStyleClassFunction) {
					entryStyleClassFunction = eval('(' + $scope.model.entryStyleClassFunction + ')');
				}
			});

			$scope.getEntryStyleClass = function(entry, fsIndex) {
				var result = '';
				if (entryStyleClassFunction) {
					result = entryStyleClassFunction(entry);
				}
				if ($scope.model.selectionClass && $scope.model.foundset.selectedRowIndexes) {
					if ($scope.model.foundset.selectedRowIndexes.indexOf(fsIndex) != -1) {
						result += ' ' + $scope.model.selectionClass;
					}
				}
				return result;
			}

			/** @type {Function} */
			var entryRendererFunction = function(entry) {
				var template = '<div>';
				for (var prop in entry) {
					if (prop.indexOf("dp") === 0) {
						template += '<div data-target="' + prop + '" ng-bind-html="entry.' + prop + '"></div>';
					}
				}
				template += '</div>';
				template += '<hr/>'
				return template;
			}

			$scope.$watch("model.entryRendererFunc", function(newValue, oldValue) {
				if ($scope.model.entryRendererFunc) {
					entryRendererFunction = eval('(' + $scope.model.entryRendererFunc + ')');
				}
			});

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
				
				//console.log(entry);
				var data = {};
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
				return data;
			}

			$scope.onEntryClick = function(entry, index, event) {
				var newSelection = [index];
				
				if ($scope.model.foundset && event.ctrlKey) {
					newSelection = $scope.model.foundset.selectedRowIndexes ? $scope.model.foundset.selectedRowIndexes.slice() : [];
					var idxInSelected = newSelection.indexOf(index);
					if (idxInSelected == -1) {
						newSelection.push(index);
					} else if (newSelection.length > 1) {
						newSelection.splice(idxInSelected, 1);
					}
				} else if ($scope.model.foundset && event.shiftKey) {
					var start = -1;
					if ($scope.model.foundset.selectedRowIndexes) {
						for (var j = 0; j < $scope.model.foundset.selectedRowIndexes.length; j++) {
							if (start == -1 || start > $scope.model.foundset.selectedRowIndexes[j]) {
								start = $scope.model.foundset.selectedRowIndexes[j];
							}
						}
					}
					var stop = index;
					if (start > index) {
						stop = start;
						start = index;
					}
					newSelection = []
					for (var n = start; n <= stop; n++) {
						newSelection.push(n);
					}
				}

				if ($scope.model.foundset) {
					$scope.model.foundset.requestSelectionUpdate(newSelection);
					index ++;
				}
				
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

			var foundsetListener = function(changes) {
				// check to see what actually changed and update what is needed in browser
				if (changes[$foundsetTypeConstants.NOTIFY_VIEW_PORT_ROWS_COMPLETELY_CHANGED]) {
					loadDataFromFoundset();

					// Force a digest to be called
					$scope.$digest();
				} else if (changes[$foundsetTypeConstants.NOTIFY_VIEW_PORT_ROW_UPDATES_RECEIVED]) {
					loadDataFromFoundset();
				}
			};

			$scope.$watch('model.foundset', function(oldValue, newValue) {
				if ($scope.svyServoyapi.isInDesigner() || !newValue) return;

				// load data
				loadDataFromFoundset();

				// addFoundsetListener
				$scope.model.foundset.addChangeListener(foundsetListener);
			});

			function loadDataFromFoundset() {
				if ($scope.model.foundset) {
					var data = [];
					for (var i = 0; i < $scope.model.foundset.viewPort.rows.length; i++) {
						var sanitizedRow = $scope.getSanitizedData($scope.model.foundset.viewPort.rows[i]);
						data.push(sanitizedRow);
					}
					$scope.model.data = data;
				}
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

			// the scrollparent may actually change.. can never be done !!
			var scrollParent = elementList;
			if (!scrollParent) {
				console.log('cannot find element');
			} else {
				scrollParent.scroll(onScroll);
			}

			function onScroll(e) {

				// scroll
				var scrollTop = scrollParent.scrollTop();
				var scrollHeight = scrollParent[0].scrollHeight;
				var offsetHeight = scrollParent[0].offsetHeight;
				var scrollDiff = scrollHeight - scrollTop;
				var offsetDiff = scrollDiff - offsetHeight;

				if (offsetDiff < 25 && hasMoreRows()) {
					$scope.model.foundset.loadExtraRecordsAsync(70, false);
				}
			}

			function hasMoreRows() {
				if ($scope.model.foundset) {
					var foundset = $scope.model.foundset;
					var viewPortLastIndex = foundset.viewPort.startIndex + foundset.viewPort.size;
					return $scope.model.foundset.hasMoreRows || viewPortLastIndex < foundset.serverSize;
				}
			}

			var destroyListenerUnreg = $scope.$on("$destroy", function() {
					scrollParent.off('scroll');
					if ($scope.model.foundset) {
						$scope.model.foundset.removeChangeListener(foundsetListener);
					}
					destroyListenerUnreg();
				});

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