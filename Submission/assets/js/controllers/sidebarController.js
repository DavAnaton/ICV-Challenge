angular.module("PathFinder")
.controller('SidebarController', SidebarController);

function SidebarController($scope, Colors){
    $scope.clicked = null;
    $scope.settingVisible = false;
    $scope.colors = Colors.getColors();

    var $boardScope = angular.element(document.querySelector('[ng-controller = "BoardController"]')).scope();

    // Start button is pressed
    $scope.start = function(){
        $scope.clicked = ($scope.clicked=='start') ? null : 'start';
        $boardScope.$$childTail.changeClickTo($scope.clicked);
    }
    // End button is pressed
    $scope.end = function(){
        $scope.clicked = ($scope.clicked=='end') ? null : 'end';
        $boardScope.$$childTail.changeClickTo($scope.clicked);
    }
    // Go button is pressed: BFS is running
    $scope.go = function(){
        $scope.clicked = ($scope.clicked=='go') ? null : 'go';
        $boardScope.$$childTail.BFS();
    }
    // Fill Board button is pressed: Test board is loaded
    $scope.test = function(){
        $boardScope.$$childTail.fillTest();
    }
    // Hides / Shows the settings
    $scope.toggleSettings = function(){
        $scope.settingVisible = !$scope.settingVisible;
    }
    // Send the color to the board controller
    $scope.updateColors = function(){
        Colors.setColors($scope.colors);
    }
};