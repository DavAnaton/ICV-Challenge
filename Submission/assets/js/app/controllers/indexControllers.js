angular.module("PathFinder")
/////////////////////////////
//////BoardController////////
/////////////////////////////
.controller('BoardController', function BoardController($scope, $rootScope, $interval, $timeout, Colors, BFS){
    $scope.colors = Colors.getColors(); // Gets the colors for the tiles 
    $scope.size = 12; // Size of the board
    BFS.setSize($scope.size);
    $scope.points = {start: null, end: null}; // Start and end points

    /*
        Sets all the tiles to their default state
    */
    $scope.resetBoard = function(){
        $scope.tiles = []; // Array of tiles
        for (i = 0; i < $scope.size*$scope.size; i++) {
            $scope.tiles.push({selected: false});
        }
        BFS.setBoard($scope.tiles);
        $scope.points.start = null; // The starting point
        $scope.points.end = null; // The ending point
        BFS.setPoints($scope.points);
    }
    $scope.resetBoard();

    // Changes the behaviour of a click on a tile
    $rootScope.$on('changeClick', function(e, newValue){
        if(!newValue){ // if null
            newValue = 'default';
        }
        $scope.tileClicked = tileFunctions[newValue];
    });
    var tileFunctions = {
        // Changes the color of the tile
        default: function(index){
            if(index!=$scope.points.start && index!=$scope.points.end){
                $scope.tiles[index].selected = !$scope.tiles[index].selected; 
            }
        },
        // Selects the starting point
        start: function(index){
            $scope.points.start = index;
            BFS.setPoints($scope.points);
            $scope.tiles[index].selected = false;
            $rootScope.$emit('changeClick', 'default');
        },
        // Selects the ending point
        end: function(index){
            $scope.points.end = index;
            BFS.setPoints($scope.points);
            $scope.tiles[index].selected = false;
            $rootScope.$emit('changeClick', 'default');
        }, 
        none: ()=>{}
    }
    // Sets the default function to changing the color
    $scope.tileClicked = tileFunctions.default;


    // Sets a test board to make testing easier
    $rootScope.$on('fillTest', function(){
        $scope.resetBoard()
        $scope.points.start = 0;
        $scope.points.end = $scope.size-1;
        BFS.setPoints($scope.points);
        var selected = [1, 5, 10, 13, 15, 16, 17, 19, 20, 22, 27, 31, 34, 37, 38, 39, 41, 43, 45, 46, 49, 53, 55, 58, 61, 62, 63, 64, 65, 67, 68, 70, 79, 82, 85, 86, 87, 88, 89, 90, 91, 93, 94, 97, 101, 109, 111, 113, 115, 117, 119, 121, 123, 125, 126, 127, 128, 129, 131, 135, 137];
        selected.map(function(item){
            $scope.tiles[item].selected = true;
        });
    });
    // Reset board
    $rootScope.$on('resetBoard', function(){
        $scope.resetBoard();
    });

    $scope.path = [];
    var setPath = function(path){
        var i = 0;
        var interval = $interval(function(){
            if(i == path.length){ // End of Path: wait 1s and redirect
                $interval.cancel(interval);
                $timeout(function() {
                    var url = window.location.href.replace('index', 'results');
                    url += "?steps=" + $scope.steps + "&time=" + $scope.runtime;
                    window.location.href = url;
                }, 1000);
            }else{ // else, color 1 more tile
                $scope.path.push(path[i]);
                i++;
            }
        }, 100)
    }
    $rootScope.$on('ResultsUpdated', function(e, results){
        setPath(results.path);
        $scope.steps = results.steps;
        $scope.runtime = results.runtime;
    })

    $scope.getColorFor = function(index){
        var color = "#";
        if($scope.path.indexOf(index)!=-1){
            color+=$scope.colors.C;
        }else if($scope.tiles[index].selected){
            color+=$scope.colors.B;
        }else{
            color+=$scope.colors.A;
        }
        return color;
    }
})
/////////////////////////////
//////SidebarController//////
/////////////////////////////
.controller('SidebarController', function SidebarController($scope, $rootScope, Colors, BFS){
    $scope.clicked = null;
    $scope.colors = Colors.getColors();
    $scope.advanced = false;

    $rootScope.$on('changeClick', function(e, value){
        $scope.clicked = value;
    })
    
    // Start button is pressed
    $scope.start = function(){
        $rootScope.$emit('changeClick', ($scope.clicked=='start') ? null : 'start');
    }
    // End button is pressed
    $scope.end = function(){
        $rootScope.$emit('changeClick', ($scope.clicked=='end') ? null : 'end');
    }
    // Fill Board button is pressed: Test board is loaded
    $scope.test = function(){
        $scope.clicked = null;
    $rootScope.$emit('newMessage', {text:'Test values loaded', type: 'info'});
        $rootScope.$emit('fillTest');
    }
    // Reset Board button is pressed: Board is reset
    $scope.reset = function(){
        $scope.clicked = null;
        $rootScope.$emit('newMessage', {text:'Default values loaded', type: 'info'});
        $rootScope.$emit('resetBoard');
    }
    // Hides / Shows the settings
    $scope.toggleSettings = function(){
        $rootScope.$emit('changeClick', ($scope.clicked=='settings') ? null : 'settings');
    }
    // Hides / Shows the settings
    $scope.advancedMode = function(){
        $scope.advanced = !$scope.advanced;
    }
    // Go button is pressed: BFS is running
    $scope.go = function(){
        if(BFS.isReady()){
            $rootScope.$emit('newMessage', {text:'BFS running', type: 'success'});
            $scope.clicked = 'go';
            $rootScope.$emit('changeClick', 'none');
            BFS.run();
        }else{
            $rootScope.$emit('newMessage', {text:'You need to define a starting and ending points', type: 'error'});
        }
    }
})
.controller('MessagesController', function($scope, $rootScope, $timeout){
    $scope.messages = [];
    var timeouts = [];
    $rootScope.$on('newMessage', function(e, message){
        var index = $scope.messages.push(message) - 1;
        timeouts.push($timeout(function(){
            $scope.close(message)
        }, 2000))
    })
    $scope.close = function(message){
        var index = $scope.messages.indexOf(message);
        $scope.messages.splice(index, 1);
        timeouts.splice(index, 1);
    }
});