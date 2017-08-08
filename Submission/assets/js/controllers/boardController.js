angular.module("PathFinder")
.controller('BoardController', BoardController);

function BoardController($scope, $interval){
    $scope.size = 12; // Size of the board
    $scope.tiles = []; // Array of tiles

    $scope.startIndex = null; // The starting point
    $scope.endIndex = null; // The ending point
    $scope.path = [];

    // Sets all the tiles to their default state
    $scope.resetTiles = function(){
        $scope.tiles = [];
        for (i = 0; i < $scope.size*$scope.size; i++) {
            $scope.tiles.push({selected: false});
        }
        $scope.startIndex = null;
        $scope.endIndex = null;
    }
    $scope.resetTiles();

    // All the click functions for the tiles
    var tileFunctions = {
        // Changes the color of the tile
        default: function(index){
            if(index!=$scope.startIndex && index!=$scope.endIndex){
                $scope.tiles[index].selected = !$scope.tiles[index].selected; 
            }
        },
        // Selects the starting point
        start: function(index){
            $scope.startIndex = index;
            $scope.tiles[index].selected = false;
            $scope.changeClickTo('default');
            
            var $sidebarScope = angular.element(document.querySelector('[ng-controller = "SidebarController"]')).scope();
            $sidebarScope.clicked = null;
        },
        // Selects the ending point
        end: function(index){
            $scope.endIndex = index;
            $scope.tiles[index].selected = false;
            $scope.changeClickTo('default');
            
            var $sidebarScope = angular.element(document.querySelector('[ng-controller = "SidebarController"]')).scope();
            $sidebarScope.clicked = null;
        }
    }
    // Changes the behaviour of a click on a tile
    $scope.changeClickTo = function(newValue){
        if(!newValue){
            newValue = 'default';
        }
        $scope.tileClicked = tileFunctions[newValue];
    }

    // Sets the default function to changing the color
    $scope.tileClicked = tileFunctions.default;

    // Sets a test board to make testing easier
    $scope.fillTest = function(){
        $scope.startIndex = 0;
        $scope.endIndex = $scope.size-1;
        var selected = [1, 5, 10, 13, 15, 16, 17, 19, 20, 22, 27, 31, 34, 37, 38, 39, 41, 43, 45, 46, 49, 53, 55, 58, 61, 62, 63, 64, 65, 67, 68, 70, 79, 82, 85, 86, 87, 88, 89, 90, 91, 93, 94, 97, 101, 109, 111, 113, 115, 117, 119, 121, 123, 125, 126, 127, 128, 129, 131, 135, 137];
        selected.map(function(item){
            $scope.tiles[item].selected = true;
        })
    }

    // Runs BFS and find the best path
    $scope.findPath = function(){
        var current = null;
        var queue = [];

        queue.push($scope.startIndex);

        while(queue.length > 0){
            current = queue.shift();
            var neighbors = BFSfunctions.getNeighbors(current).filter(BFSfunctions.filterNeighbors);
            for(i in neighbors){
                $scope.tiles[neighbors[i]].visited = true;
                $scope.tiles[neighbors[i]].parent = current;
            }
            queue = queue.concat(neighbors);
        }
        $scope.setPath(BFSfunctions.readPath());
    }

    // Useful function for the BFS
    var BFSfunctions = {
        // Gets all neighbors tiles
        getNeighbors: function(index){
            var neighbors = [];
            var x = index % $scope.size;
            var y = Math.floor(index / $scope.size);
            var movements = [
                {x: 0, y: -1},
                {x: -1, y: 0},
                {x: 1, y: 0},
                {x: 0, y: 1}
            ];
            for(key in movements){
                var m = movements[key];
                if(x + m.x < $scope.size && x + m.x >= 0 
                && y + m.y < $scope.size && y + m.y >= 0){
                    neighbors.push((x + m.x) + $scope.size * (y + m.y));
                }
            }
            return neighbors;
        },
        // Filter neighbors to keep valid cells
        filterNeighbors: function(neighbor){
            var notColorB = !$scope.tiles[neighbor].selected;
            var notVisited = !$scope.tiles[neighbor].visited;
            if(notColorB && notVisited){
                return true;
            }else{
                return false;
            }            
        },
        // Starts from end and goes all the way to start
        readPath: function(){
            // No path was found
            if($scope.tiles[$scope.endIndex].parent==undefined){
                return [];
            }
            var current = $scope.endIndex;
            var path = [current];
            while(current!=$scope.startIndex){
                current = $scope.tiles[current].parent
                path = [current].concat(path);
            }
            return path;
        }
    }

    $scope.setPath = function(path){
        var i = 0;
        var interval = $interval(function(){
            if(i == path.length){
                $interval.cancel(interval);
            }else{
                $scope.path.push(path[i]);
                i++;
            }
        }, 100)
    }
};