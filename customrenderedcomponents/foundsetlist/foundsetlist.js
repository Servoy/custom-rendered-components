angular.module('customrenderedcomponentsFoundsetlist', ['servoy'])
.directive('customrenderedcomponentsFoundsetlist',
	['$log', '$foundsetTypeConstants', '$sce', '$timeout', function($log, $foundsetTypeConstants, $sce, $timeout) {
		return {
			restrict: 'E',
			scope: {
				model: '=svyModel',
				handlers: '=svyHandlers',
				api: '=svyApi',
				svyServoyapi: '='
			},
			/**
			 * @param {{model: {data: Array, entryRendererFunction: String, foundset: {viewPort: {size: Number, selectedRowIndexes: Array<Number>}, multiSelect: Boolean}, entryStyleClassDataProvider: String, tooltipDataProvider: String, tooltipFunction: String}, svyServoyapi: {isInDesigner: Function}, tooltipFunction: Function}} $scope
			 * @param $element
			 * @param $$attrs
			 * 
			 * @SuppressWarnings(nls)
			 */
			controller: 
			/**
			* @SuppressWarnings(nls)
			*/
			function($scope, $element, $attrs) {
				var elementList = $element.find('.svy-extra-listcomponent');
				
				if ($scope.svyServoyapi.isInDesigner()) {
					$scope.data = [{ dp0: "dp0", dp1: "dp1" }];
				}

				$scope.getEntryStyleClass = function(entry, fsIndex) {
					var result = '';
					if ($scope.model.entryStyleClassDataProvider) {
						result += $scope.model.entryStyleClassDataProvider[fsIndex];
					}
					if ($scope.model.selectionClass && $scope.model.foundset.selectedRowIndexes) {
						if ($scope.model.foundset.selectedRowIndexes.indexOf(fsIndex) != -1) {
							result += ' ' + $scope.model.selectionClass;
						}
					}
					return result;
				}

				/** @type {Function} */
				var entryRendererFunction = function(entry, index) {
					var template = '<div>';
					for (var prop in entry) {
						if (prop.indexOf("dp") === 0) {
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
						return entryRendererFunction(entry, index + 1);
					}
					return '';
				}

				$scope.tooltipFunction = function() {
					return null
				};
				$scope.$watch("model.tooltipFunction", function(newValue, oldValue) {
					if ($scope.model.tooltipFunction && !$scope.model.tooltipDataProvider) {
						$scope.tooltipFunction = eval('(' + $scope.model.tooltipFunction + ')');
					} else if ($scope.model.tooltipFunction && $scope.model.tooltipDataProvider) {
						console.warn('tooltipFunction will not be used when a tooltipDataProvider is attached as well');
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
							} else if ((typeof entryValue) === 'object' && !(entryValue instanceof Date)) {
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
				
				$scope.getSanitizedHtml = function(html) {
					if (!$scope.svyServoyapi.trustAsHtml()) {
						return $sce.getTrustedHtml(html);
					} else {
						return $sce.trustAsHtml(html);
					}
				}
				
				$scope.getTooltip = function(index) {
					if (index >= 0 && $scope.model.tooltipDataProvider && $scope.model.tooltipDataProvider[index] != undefined) {
						return $scope.model.tooltipDataProvider[index];
					}
					return null;
				}
				
				$scope.onEntryClick = function(entry, index, event) {
					var newSelection = [index];
					
					if ($scope.model.foundset && $scope.model.foundset.multiSelect == true && event.ctrlKey) {
						newSelection = $scope.model.foundset.selectedRowIndexes ? $scope.model.foundset.selectedRowIndexes.slice() : [];
						var idxInSelected = newSelection.indexOf(index);
						if (idxInSelected == -1) {
							newSelection.push(index);
						} else if (newSelection.length > 1) {
							newSelection.splice(idxInSelected, 1);
						}
					} else if ($scope.model.foundset && $scope.model.foundset.multiSelect == true && event.shiftKey) {
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
					}
					
					if ($scope.handlers.onClick) {
						var target = event.target;
						var dataTarget = $(target).closest("[data-target]");
						var data;
						if (dataTarget && dataTarget[0]) {
							data = dataTarget[0].getAttribute("data-target");
						}
						var record = $scope.model.foundset.viewPort.rows[index];
						$scope.handlers.onClick(record, index + 1, data, event);
					}
				}
				
				$scope.onFirstItemClick = function(event) {
					if ($scope.handlers.onFirstItemClick) {
						var target = event.target;
						var dataTarget = $(target).closest("[data-target]");
						var data;
						if (dataTarget && dataTarget[0]) {
							data = dataTarget[0].getAttribute("data-target");
						}
						$scope.handlers.onFirstItemClick(event, data);
					}
				}
				
				$scope.onLastItemClick = function(event) {
					if ($scope.handlers.onLastItemClick) {
						var target = event.target;
						var dataTarget = $(target).closest("[data-target]");
						var data;
						if (dataTarget && dataTarget[0]) {
							data = dataTarget[0].getAttribute("data-target");
						}
						$scope.handlers.onLastItemClick(event, data);
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
						$scope.data = data;
						
						// init the Sortable object
						initSortable();
					}
				}


				$scope.getLayoutStyle = function() {
					var layoutStyle = { };
					if ($scope.$parent.absoluteLayout) {
					} else {
						layoutStyle.position = "relative";
						if ($scope.model.responsiveDynamicHeight && $scope.model.responsiveHeight > 0) {
							layoutStyle.maxHeight = $scope.model.responsiveHeight + "px";
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
					console.warn('cannot find scroll element');
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
				
				var sortableObj;
				function initSortable() {

					/* Enable Sorting */
					if ($scope.model.dragEnabled || $scope.model.dropEnabled || $scope.model.sortableEnabled) {
						var sortOptions = $scope.model.dragSortableOptions || { };
						var opts = { };

						/** Drag Options */
						opts.sort = $scope.model.sortableEnabled;

						opts.group = {
							pull: $scope.model.dragEnabled, // can drag into other lists
							put: $scope.model.dropEnabled, // can drop from other lists
						};
						
						// copy data upon drag
						if ($scope.model.dragEnabled) {
							opts.setData = setData;
						}

						// group name
						if ($scope.model.dragEnabled || $scope.model.dropEnabled) {
							opts.group.name = sortOptions.group || "shared-foundsetlist"
						}

						// if drag type is copy
						if ($scope.model.dragEnabled && sortOptions.dragType == "COPY") {
							opts.group.pull = "clone"
						}

						/** Common options */
						if (sortOptions.handle) opts.handle = sortOptions.handle;
						if (sortOptions.animation) opts.animation = sortOptions.animation;
						if (sortOptions.selectedClass) opts.selectedClass = sortOptions.selectedClass;

						/** Enable Multi Drag */
						if (sortOptions.multiDrag) {
							opts.multiDrag = true;
							opts.selectedClass = 'svyextra-listcomponent-dragselected';
							if (sortOptions.multiDragKey) opts.multiDragKey = sortOptions.multiDragKey;
						}

						/** Events */
						if ($scope.handlers.onDrop) {
							opts.onAdd = onAdd;
						}

						if ($scope.handlers.onSortEnd) {
							opts.onEnd = onSortEnd;
						}

						if (sortableObj) {
							sortableObj.destroy();
						}
						sortableObj = Sortable.create($element.find('.svy-extra-listcomponent')[0], opts);
					}
				}
				
				/**
				 * @private 
				 * Store draggable data when dragEnabled=true
				 *  */
				function setData(/** DataTransfer */dataTransfer, /** HTMLElement*/dragEl) {

					var idx;
					var evtOldIndices = [];
					var dragElSelected = null;
					if ($scope.model.dragSortableOptions && $scope.model.dragSortableOptions.multiDrag) {
						// when multiDrag enabled, find all selected elements. Are the one having the selected class equal to svyextra-listcomponent-dragselected
						dragElSelected = $element.find('.svyextra-listcomponent-dragselected');
						for (var j = 0; j < dragElSelected.length; j++) {
							idx = dragElSelected[j].getAttribute("data-idx");
							evtOldIndices.push(idx);
						}
					} 
					
					// get the idx of the selected element
					if (!dragElSelected || !dragElSelected.length){
						idx = dragEl.getAttribute("data-idx");
						evtOldIndices = [idx];
					}
								
					// get the record reference based on svyRowId
					var records = [];
					for (var i = 0; i < evtOldIndices.length; i++) {
						var rowID = $scope.model.foundset.viewPort.rows[evtOldIndices[i]]._svyRowId;
						var record =  $scope.model.foundset.getRecordRefByRowID(rowID);
						records.push(record);
					}

					dataTransfer.setData('records', JSON.stringify(records)); // `dataTransfer` object of HTML5 DragEvent
				}
								
				/**
				 * @private 
				 * When item is dropped into list (MOVED or COPIED)
				 *  */
				function onAdd(evt) {

					// get the dragged data from the DataTransfer object (see setData)
					var records = JSON.parse(evt.originalEvent.dataTransfer.getData("records"));
					
					var evtOldIndices = (evt.oldIndicies.length ? evt.oldIndicies : null) || [{index: evt.oldIndex}];
					var evtNewIndices = (evt.newIndicies.length ? evt.newIndicies : null) || [{index: evt.newIndex}];
					var oldIndicies = [];
					var newIndicies = [];
					var recordsMovedTo = [];
					
					for (var o = 0; o < evtNewIndices.length; o++) {
						// track old foundset indexes (1-based)
						oldIndicies.push(evtOldIndices[o].index + 1);
						
						// track new foundset indexes (1-based)
						var newIdx = evtNewIndices[o].index;
						newIndicies.push(newIdx + 1);
						recordsMovedTo.push($scope.model.foundset.viewPort.rows[newIdx]);
					}
					
					var cloned = false;
					
					if (evt.pullMode == 'clone') {
						cloned = true
					} else if (evt.pullMode == true) {
						cloned = false;
					}
					
					// if handler is available
					if ($scope.handlers.onDrop) {
						$scope.handlers.onDrop(evt, oldIndicies, newIndicies, records, recordsMovedTo).then(function () {
							loadDataFromFoundset();
						});
					}	
				}
				
				function onSortEnd(evt) {
					console.log('END');

					if (evt.pullMode == 'clone') {
						// TODO shall call an apply ?

					} else if (evt.pullMode == true) {
						// drag & drop
					} else { // change sort index
					
						var evtOldIndices = (evt.oldIndicies.length ? evt.oldIndicies : null) || [{index: evt.oldIndex}];
						var evtNewIndices = (evt.newIndicies.length ? evt.newIndicies : null) || [{index: evt.newIndex}];
						var oldIndicies = [];
						var newIndicies = [];
						var recordsMoved = [];
						var recordsMovedTo = [];
						
						for (var o = 0; o < evtOldIndices.length; o++) {
							oldIndicies.push(evtOldIndices[o].index + 1);
							recordsMoved.push($scope.model.foundset.viewPort.rows[evtOldIndices[o].index]);
							newIndicies.push(evtNewIndices[o].index + 1);
							recordsMovedTo.push($scope.model.foundset.viewPort.rows[evtNewIndices[o].index]);
						}
						
						if ($scope.handlers.onSortEnd) {
							$scope.handlers.onSortEnd(evt, oldIndicies, newIndicies, recordsMoved, recordsMovedTo);
						}
					}
				}
				
				/**
				 * @deprecated unused
				 * Create a JSEvent
				 *
				 * @return {JSEvent}
				 * */
				function createJSEvent(el) {
					var offset = $(el).offset();
					var x = offset.left;
					var y = offset.top;

					var event = document.createEvent("MouseEvents");
					event.initMouseEvent("move", false, true, window, 1, x, y, x, y, false, false, false, false, 0, null);
					return event;
				}


				var destroyListenerUnreg = $scope.$on("$destroy", function() {
						scrollParent.off('scroll');
						if ($scope.model.foundset) {
							$scope.model.foundset.removeChangeListener(foundsetListener);
						}
						destroyListenerUnreg();
					});				
			},
			templateUrl: 'customrenderedcomponents/foundsetlist/foundsetlist.html'
		};
	}]
)
.directive('bindListHtmlCompile', ['$compile', function($compile) {
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
					}
				);
			}
		}
	}]
);