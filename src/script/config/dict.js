    'use strict';
    angular.module('app').value('dict',{}).run(['dict','$http',function(dict,$http){
        $http.get('data/city.json').then(function(info){
            dict.city = info;
        });
        $http.get('data/salary.json').then(function(info){
            dict.salary = info;
        });
        $http.get('data/scale.json').then(function(info){
            dict.scale = info;
        });
    }])
