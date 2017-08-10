angular.module("PathFinder")

// Given an integer n, it creates the sequence from 0 to n-1
.filter('range', function(){
    return function(n) {
        var res = [];
        for (var i = 0; i < n; i++) {
            res.push(i);
        }
        return res;
    };
});