$scope.api.newEntry = function() {
	if(!$scope.model.data) {
        $scope.model.data = [];
    }

    var entry = {};
    $scope.model.data.push(entry);
    return $scope.model.data[$scope.model.data.length - 1];
}

$scope.api.clear = function() {
    $scope.model.data = [];
}

$scope.api.getEntriesCount = function (index) {
	if ($scope.model.data) {
        return $scope.model.data.length;
    }
    return 0;
}

$scope.api.getEntry = function (index) {
	if($scope.model.data && index <= $scope.model.data.length) {
        return $scope.model.data[index];
    }
    return null;
}

$scope.api.removeEntry = function (index) {
	if($scope.model.data && index <= $scope.model.data.length) {
      	$scope.model.data.splice(index, 1);
    	return true;
    }
    return false;
}

$scope.api.setEntries = function (entries) {
	$scope.model.data = entries;
}

$scope.callMethod = function (methodName, index, dataTarget, event) {
	if (methodName == 'onClick') {
		$scope.handlers.onClick($scope.api.getEntry(index), index, dataTarget, event);
	} else if (methodName == 'onRightClickMethodID') {
		$scope.handlers.onRightClickMethodID($scope.api.getEntry(index), index, dataTarget, event);
	}	else if (methodName == 'onDoubleClickMethodID') {
		$scope.handlers.onDoubleClickMethodID($scope.api.getEntry(index), index, dataTarget, event);
	}
}