angular.module("PathFinder")
.controller('BoardController', BoardController);

function BoardController($scope){
    $scope.size = 12; // Size of the board
    $scope.tiles = []; // Array of tiles

    $scope.startIndex = null; // The starting point

    // Sets all the tiles to their default state
    $scope.resetTiles = function(){
        $scope.tiles = [];
        for (i = 0; i < $scope.size*$scope.size; i++) {
            $scope.tiles.push({selected: false});
        }
        $scope.startIndex = null;
    }
    $scope.resetTiles();

    // All the click functions for the tiles
    var tileFunctions = {
        // Changes the color of the tile
        default: function(index){
            if(index!=$scope.startIndex){
                $scope.tiles[index].selected = !$scope.tiles[index].selected; 
            }
        },
        // Selects the starting point
        start: function(index){
            $scope.startIndex = index;
            $scope.tiles[index].selected = false;
            $scope.changeClickTo('default');
            
            var $sidebarScope = angular.element(document.querySelector('[ng-controller = "SidebarController"]')).scope();
            $sidebarScope.startClicked = false;
        }
    }
    // Changes the behaviour of a click on a tile
    $scope.changeClickTo = function(newValue){
        $scope.tileClicked = tileFunctions[newValue];
    }

    // Sets the default function to changing the color
    $scope.tileClicked = tileFunctions.default;

};