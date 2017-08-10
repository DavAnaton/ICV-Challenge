angular.module("PathFinder")
.controller('ResultsController', ResultsController);

function ResultsController($scope, $location){
    var stringParams = $location.absUrl().split('?')[1].split('&');
    var params = {};
    for(index in stringParams){
        var param = stringParams[index];
        params[param.split('=')[0]] = param.split('=')[1];
    }
    $scope.time = params.time;
    $scope.steps = params.steps;
};