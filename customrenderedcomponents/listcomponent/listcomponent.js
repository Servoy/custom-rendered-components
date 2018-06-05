angular.module('customrenderedcomponentsListcomponent',['servoy']).directive('customrenderedcomponentsListcomponent', ['$log', '$foundsetTypeConstants', function($log, $foundsetTypeConstants) {
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

			if ($scope.svyServoyapi.isInDesigner()) {
				$scope.model.data = [{ dp0: "dp0", dp1: "dp1" }];
			}

			var entryStyleClassFunc = null;
			$scope.$watch("model.entryStyleClassFunc", function(newValue, oldValue) {
					if ($scope.model.entryStyleClassFunc) {
						entryStyleClassFunc = eval($scope.model.entryStyleClassFunc);
					}
				});

			$scope.getEntryStyleClass = function(entry) {
				if (entryStyleClassFunc) {
					return entryStyleClassFunc(entry);
				}
				return '';
			}

			// var entryRendererFunc = function(entry) {
			// 	return '<div class="feed-icon"></div>' + '<div class="feed-subject" svy-tooltip="entry.tooltip">' + entry.subject + ' </div>' + '<div class="feed-content">' + entry.content + '</div>' + '<div class="feed-actions"><div class="pull-right"><i class="fa fa-clock-o"></i>' + entry.time + '</div></div>';
			// }

			var entryRendererFunc = function(entry) {
				var template = '<div>';
				template += '<i class="pull-right fa fa-tag" data-target="icon"></i>';
				for (var prop in entry) {
					if (prop.indexOf("dp") === 0) {
						template += '<div class="feed-subject" data-target="' + prop + '">' + entry[prop] + '</div>';
					}
				}
				template += '</div>';
				template + '<hr/>'
				return template;
			}

			$scope.$watch("model.entryRendererFunc", function(newValue, oldValue) {
					if ($scope.model.entryRendererFunc) {
						entryRendererFunc = eval($scope.model.entryRendererFunc);
					}
				});

			$scope.getEntryRenderer = function(entry) {
				if (entryRendererFunc) {
					return entryRendererFunc(entry);
				}
				return '';
			}

			$scope.onEntryClick = function(entry, index, event) {
				if ($scope.handlers.onClick) {
					var target = event.target;
					var dataTarget = target.closest("[data-target]");
					var data;
					if (dataTarget) {
						data = dataTarget.getAttribute("data-target");
					}
					$scope.handlers.onClick(entry, index, data, data);
				}
			}

			var foundsetListener = function(changes) {
				// check to see what actually changed and update what is needed in browser
				if (changes[$foundsetTypeConstants.NOTIFY_VIEW_PORT_ROWS_COMPLETELY_CHANGED]) {
					loadDataFromFoundset();

					// Force a digest to be called
					$scope.$digest();
				}
			};

			$scope.$watch('model.foundset', function(oldValue, newValue) {
					if ($scope.svyServoyapi.isInDesigner()) return;

					// load data
					loadDataFromFoundset();

					// addFoundsetListener
					$scope.model.foundset.addChangeListener(foundsetListener);
				});

			//				$scope.$watch('model.foundset.serverSize', function(oldValue, newValue) {
			//					if (!$scope.svyServoyapi || $scope.svyServoyapi.isInDesigner()) return;
			//					loadDataFromFoundset();
			//				});

			function loadDataFromFoundset() {
				if ($scope.model.foundset) {
					$scope.model.data = $scope.model.foundset.viewPort.rows;
				}
			}

			$scope.getStyle = function() {
				var style = { };
				if ($scope.$parent.absoluteLayout) {

				} else {
					style.maxHeight = $scope.model.responsiveHeight + "px";
				}
				return style;
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

					if ($scope.model.foundset) $scope.model.foundset.removeChangeListener(foundsetListener);
					destroyListenerUnreg();
					// delete $scope.model[$sabloConstants.modelChangeNotifier];
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