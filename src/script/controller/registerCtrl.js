'use strict';
angular.module('app').controller('registerCtrl',['$interval','$http','$scope','$state',function($interval,$http,$scope,$state){
    $scope.submit = function(){
        $http.post('data/regist.json',$scope.user).success(function(resp){
            $state.go('login');
        })
    }
    var count = 60;
    $scope.send = function(){
        $http.get('data/code.json').then(function(info){
            if(1===info.data.state){
                $scope.time = '60s';
                var interval = $interval(function(){
                    if(count<=0){
                        $interval.cancel(interval);
                        $scope.time = '';
                        return;
                    }else{
                        count--;
                        $scope.time = count+'s';
                    }
                },1000)
            }
        })
    }
}]);

