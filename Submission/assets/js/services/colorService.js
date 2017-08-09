angular.module("PathFinder")
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
});