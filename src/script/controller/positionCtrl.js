    'use strict';
    angular.module('app').controller('positionCtrl',['$q','$http','$scope','$state','cache',function($q,$http,$scope,$state,cache){
        cache.put('to','day');
        cache.remove('to');
        function getPosition(){
            var def = $q.defer();
            $http.get('data/position.json?id='+$state.params.id).then(function(info){
                $scope.position = info.data;
                def.resolve(info.data);
            });
            return def.promise;
        }
        function getCompany(id){
            $http.get('data/company.json?id='+id).then(function(info){
                $scope.company = info.data;
            })
        }
        getPosition().then(function(obj){
            getCompany(obj.companyId);
        })
    }]);
