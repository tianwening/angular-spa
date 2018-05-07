    'use strict';
    angular.module('app').controller('positionCtrl',['$log','$q','$http','$scope','$state','cache',function($log,$q,$http,$scope,$state,cache){
        $scope.isLogin = !!cache.get('name');
        $scope.message = $scope.isLogin?'投个简历':'去登录';
        function getPosition(){
            var def = $q.defer();
            $http.get('data/position.json?id='+$state.params.id).then(function(info){
                $scope.position = info.data;
                if(info.data.posted){
                    $scope.message = '已投递';
                }
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
        });
        $scope.go = function(){
            if($scope.message !== '已投递'){
                if($scope.isLogin){
                    $http.post('data/handle.json',{
                        id: $scope.position.id
                    }).success(function(resp){
                        $log.info(resp.data);
                        $scope.message = '已投递';
                    });
                }else {
                    $state.go('login');
                }
            }
        }
    }]);
