angular.module("PathFinder")
// Colors service: used to pass colors from form in sidebar to board
.factory('Colors', function(){
    var colors = {A:'eeeeee', B:'333333', C:'22cc44'};
    return {
        getColors: function(){
            return colors;
        },
        setColors: function(newColors){
            colors = newColors;
        }
    }
})

// BFS service: in charge of the algorithmic part in our app
.factory('BFS', function($rootScope){
    var board = [],
    	size = undefined,
    	start = undefined,
    	end = undefined,
        diagonals = false,
        // Given after the run
    	results = {
    		path: [],
    		runtime: undefined,
    		steps: undefined
    	};

    // Gets the neighbors to a given tile
    var getNeighbors = function(index){
        var neighbors = [];

        // First, transform index to coordinates
        var x = index % size;
        var y = Math.floor(index / size);

        var movements = [
            {x: 0, y: -1},
            {x: -1, y: 0},
            {x: 1, y: 0},
            {x: 0, y: 1},
        ];

        if(diagonals){
            movements = movements.concat([
                {x: -1, y: -1}, // Diagonal
                {x: -1, y: 1}, // Diagonal
                {x: 1, y: -1}, // Diagonal
                {x: 1, y: 1} // Diagonal
            ]);
        }

        // Generate all neighbors
        for(key in movements){
            var m = movements[key];
            if(x + m.x < size && x + m.x >= 0 
            && y + m.y < size && y + m.y >= 0){
                neighbors.push((x + m.x) + size * (y + m.y));
            }
        }
        return neighbors;
    }

    // Filter neighbors to keep valid cells
    var filterNeighbors = function(neighbor){
        var notColorB = !board[neighbor].selected;
        var notVisited = !board[neighbor].visited;
        if(notColorB && notVisited){
            return true;
        }else{
            return false;
        }            
    };

    // Starts from end and goes all the way to start
    var readPath = function(){
        // No path was found
        if(board[end].parent==undefined){
            return [];
        }
        var current = end;
        var path = [current];
        while(current!=start){
            current = board[current].parent
            path = [current].concat(path);
        }
        return path;
    }

    // Clears the board if there was a previous run of BFS
    var clearVisited = function(){
        for(index in board){
            board[index].visited = false;
            board[index].parent = undefined;
        }
    }

    return {
        run: function(){
            clearVisited();
	        var startTime = new Date();
	        var steps = 0;
	        var current = undefined;
	        var queue = [];

	        queue.push(start);
	        board[start].visited = true;

	        while(queue.length > 0){
	            current = queue.shift();
	            if(current==end){
	                break;
	            }
	            var neighbors = getNeighbors(current).filter(filterNeighbors);
	            for(i in neighbors){
	                board[neighbors[i]].visited = true;
	                board[neighbors[i]].parent = current;
	            }
	            queue = queue.concat(neighbors);
	            steps++;
	        }
	        results = {
	        	steps: steps, 
	        	runtime: new Date() - startTime,
	        	path: readPath()
	        }
            if(results.path.length == 0){
                $rootScope.$emit('changeClick', 'default');
                $rootScope.$emit('newMessage', {text: 'No path was found', type:'warning'});                
            }else{
    	        $rootScope.$emit('ResultsUpdated', results);
            }
	    },
	    setBoard: function(newBoard){
	    	board = newBoard;
	    },
    	setSize: function(newSize){
    		size = newSize;
    	},
    	setPoints: function(points){
    		start = points.start;
    		end = points.end;
    	},
        // Allow or not diagonals in the path
        setDiagonals: function(bool){
            diagonals = bool;
        },
        // BFS is ready only if it has a starting and ending point
        isReady: function(){
            return start!=undefined && end!=undefined;
        },
    	getResults: function(){
    		return results;
    	}
    }
});