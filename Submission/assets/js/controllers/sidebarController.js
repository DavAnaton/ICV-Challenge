angular.module("PathFinder")
.controller('SidebarController', SidebarController);

function SidebarController($scope){
    $scope.clicked = null;

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
};