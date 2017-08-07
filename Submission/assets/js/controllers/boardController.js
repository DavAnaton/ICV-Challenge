angular.module("PathFinder")
.controller('BoardController', BoardController);

function BoardController($scope){
    $scope.size = 12;
};