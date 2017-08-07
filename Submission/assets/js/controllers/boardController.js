angular.module("PathFinder")
.controller('BoardController', BoardController);

function BoardController($scope){
    $scope.size = 12;
    $scope.tiles = [];

    $scope.resetTiles = function(){
        $scope.tiles = [];
        for (i = 0; i < $scope.size*$scope.size; i++) {
            $scope.tiles.push({selected: false});
        }
    }
    $scope.resetTiles();

    $scope.tileClicked = function(index){
        $scope.tiles[index].selected = !$scope.tiles[index].selected; 
    }
};