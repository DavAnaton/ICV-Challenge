angular.module("PathFinder")
.controller('SidebarController', SidebarController);

function SidebarController($scope){
    $scope.startClicked = false;

    var $boardScope = angular.element(document.querySelector('[ng-controller = "BoardController"]')).scope();
    
    console.log($boardScope)
    // Start button is pressed
    $scope.start = function(){
        $scope.startClicked = !$scope.startClicked;
        if($scope.startClicked){
            $boardScope.$$childTail.changeClickTo('start'); 
        }else{
            // If it was already clicked, sets the default behaviour
            $boardScope.$$childTail.changeClickTo('default'); 
        }
    }
};