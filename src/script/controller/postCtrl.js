'use strict';
angular.module('app').controller('postCtrl',['$scope',function($scope){
    $scope.tabList = [
        {
            id: 'all',
            name: '全部'
        },
        {
            id: 'pass',
            name: '邀请面试'
        },
        {
            id: 'fail',
            name: '不合适'
        }
    ]
}]);

