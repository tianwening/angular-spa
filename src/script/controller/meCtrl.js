'use strict';
angular.module('app').controller('meCtrl',['cache','$scope','$state',function(cache,$scope,$state){
    if(cache.get('name')){
        $scope.name = cache.get('name');
        $scope.image = cache.get('image');
    }$scope.logout = function(){
        cache.remove('id');
        cache.remove('name');
        cache.remove('image');
        $state.go('main');
    }
}]);

