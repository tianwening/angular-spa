    'use strict';

    angular.module('app',['ui.router','ngCookies','validation']);


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

'use strict';
angular.module('app').config(['$provide', function($provide){
    $provide.decorator('$http', ['$delegate', '$q', function($delegate, $q){
        $delegate.post = function(url, data, config) {
            var def = $q.defer();
            $delegate.get(url).then(function(resp){
                def.resolve(resp);
            },function(err){
                def.reject(err);
            })
            return {
                success: function(cb){
                    def.promise.then(cb);
                },
                error: function(cb) {
                    def.promise.then(null, cb);
                }
            }
        }
        return $delegate;
    }]);
}]);

    'user strict';

    angular.module('app').config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
        $stateProvider.state('main',{
            url: '/main',
            templateUrl: 'view/main.html',
            controller: 'mainCtrl'
        }).state('position',{
            url: '/position/:id',
            templateUrl: 'view/position.html',
            controller: 'positionCtrl'
        }).state('company',{
            url: '/company/:id',
            templateUrl: 'view/company.html',
            controller: 'companyCtrl'
        }).state('search',{
            url: '/search',
            templateUrl: 'view/search.html',
            controller: 'searchCtrl'
        }).state('login',{
            url: '/login',
            templateUrl: 'view/login.html',
            controller: 'loginCtrl'
        }).state('register',{
            url: '/register',
            templateUrl: 'view/register.html',
            controller: 'registerCtrl'
        }).state('me',{
            url: '/me',
            templateUrl: 'view/me.html',
            controller: 'meCtrl'
        }).state('favorite',{
            url: '/favorite',
            templateUrl: 'view/favorite.html',
            controller: 'favoriteCtrl'
        }).state('post',{
            url: '/post',
            templateUrl: 'view/post.html',
            controller: 'postCtrl'
        });
        $urlRouterProvider.otherwise('main');
    }])

    'use strict';

    angular.module('app').config(['$validationProvider',function($validationProvider){
        var expression = {
            phone: /^1[\d]{10}$/,
            password: function(value){
                var str = value+'';
                return str.length > 5;
            },
            required: function(value){
                return !!value;
            }
        };
        var defaultMsg = {
            phone: {
                success: '',
                error: '必须是11位手机号'
            },
            password: {
                success: '',
                error: '长度至少6位'
            },
            required: {
                succsee: '',
                error: '不能为空'
            }
        };
        $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
    }])

    'use strict';

    angular.module('app').controller('companyCtrl',['$http','$state','$scope',function($http,$state,$scope){
        $http.get('data/company.json?id='+$state.params.id).then(function(info){
            $scope.company = info.data;
        });
    }])

'use strict';
angular.module('app').controller('favoriteCtrl',['$http','$scope',function($http,$scope){
    $http.get('data/myFavorite.json').then(function(resp){
        $scope.list = resp.data;
    })
}]);


'use strict';
angular.module('app').controller('loginCtrl',['cache','$http','$scope','$state',function(cache,$http,$scope,$state){
    $scope.submit = function(){
        $http.post('data/login.json').success(function(resp){
            cache.put('id',resp.data.id);
            cache.put('name',resp.data.name);
            cache.put('image',resp.data.image);
            $state.go('main');
        })
    }
}]);


    'use strict';
    angular.module('app').controller('mainCtrl',['$http','$scope',function($http,$scope){
        $http.get('/data/positionList.json').then(function(info){
            $scope.list = info.data;
        });
    }]);

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

'use strict';
angular.module('app').controller('postCtrl',['$http','$scope',function($http,$scope){
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
    ];
    $http.get('data/myPost.json').then(function(resp){
        $scope.positionList = resp.data;
    });
    $scope.filterObj = {};
    $scope.tClick = function(id, name) {
        //console.log(id,name);
        switch (id) {
            case 'all':
                delete $scope.filterObj.state;
                break;
            case 'pass':
                $scope.filterObj.state = '1';
                break;
            case 'fail':
                $scope.filterObj.state = '-1';
                break;
            default:

        }
    }
}]);


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


'use strict';
angular.module('app').controller('searchCtrl',['dict','$http','$scope',function(dict,$http,$scope){
    $scope.name = '';
    $scope.search = function() {
        $http.get('data/positionList.json?name='+$scope.name).then(function(info) {
            $scope.positionList = info.data;
        });
    };
    $scope.search();
    $scope.sheet = {};
    $scope.filterObj = {};
    $scope.tabList = [
        {
            id: 'city',
            name: '城市'
        },
        {
            id: 'salary',
            name: '薪水'
        },
        {
            id: 'scale',
            name: '公司规模'
        }
    ];
    var tabId = '';
    $scope.tClick = function(id,name){
        tabId = id;
        $scope.sheet.list = dict[id].data;
        $scope.sheet.visible = true;
        //console.log($scope.sheet);
        //console.log(id);
    };
    $scope.sClick = function(id,name){
        if(id){
            angular.forEach($scope.tabList,function(item){
                if(item.id===tabId){
                    item.name = name;
                }
            });
            $scope.filterObj[tabId + 'Id'] = id;
        }else{
            delete $scope.filterObj[tabId + 'Id'];
            angular.forEach($scope.tabList,function(item){
                if(item.id===tabId){
                    switch(item.id){
                        case 'city':
                            item.name = '城市';
                            break;
                        case 'salary':
                            item.name = '薪水';
                            break;
                        case 'scale':
                            item.name = '公司规模';
                            break;
                        default:
                    }
                }
                console.log(item);
            })
        }
    }
}]);

    'use strict';

    angular.module('app').directive('appCompany',[function(){
        return {
            restrict: 'A',
            replace: true,
            scope: {
                com: '='
            },
            templateUrl: 'view/template/companyInfo.html'
        }
    }])

    'use strict';

      angular.module('app').directive('appFoot',[function(){
            return {
                restrict: 'A',
                replace: true,
                templateUrl: 'view/template/foot.html'
            };
      }]);

    'use strict';
    angular.module('app').directive('appHead',['cache',function(cache){
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'view/template/head.html',
            link: function($scope){
                $scope.name = cache.get('name')||'';
            }
        }
    }])

'use strict';
angular.module('app').directive('appHeadBar',[function(){
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/headBar.html',
        scope: {
            text: '@'
        },
        link: function($scope){
            $scope.back = function(){
                window.history.back();
            }
        }
    }
}])

    'use strict';

    angular.module('app').directive('appPositionClass',[function(){
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'view/template/positionClass.html',
            scope: {
                com: '='
            },
            link: function($scope){
                $scope.showPositionList = function(idx){
                    $scope.positionList = $scope.com.positionClass[idx].positionList;
                    $scope.isActive = idx;
                };
                $scope.$watch('com',function(newVal){
                    if(newVal){
                        $scope.showPositionList(0);
                    }
                });
            }
        }
    }])

    'use strict';

    angular.module('app').directive('appPositionInfo',['$http',function($http){
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'view/template/positionInfo.html',
            scope: {
                isActive: '=',
                isLogin: '=',
                pos: '='
            },
            link: function($scope){
                $scope.$watch('pos',function(newVal){
                    if(newVal){
                        $scope.pos.select = $scope.pos.select||false;
                        $scope.imagePath = $scope.isActive?'image/star-active.png':'image/star.png';
                    }
                });

                $scope.favorite = function(){
                    $http.post('data/favorite.json',{
                        id: $scope.pos.id,
                        select: !$scope.pos.select
                    }).success(function(){
                        $scope.pos.select = !$scope.pos.select;
                        $scope.imagePath = $scope.pos.select?'image/star-active.png':'image/star.png';
                    })
                }
            }
        }
    }])

    'use strict';
    angular.module('app').directive('appPositionList',['$http',function($http){
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'view/template/positionList.html',
            scope: {
                data: '=',
                filterObj: '=',
                isFavorite: '='
            },
            link: function($scope){
                //$scope.name = cache.get('name')||'';
                $scope.select = function(item){
                    $http.post('data/favorite.json',{
                        id: item.id,
                        select: !item.select
                    }).success(function(resp){
                        item.select = !item.select;
                    })
                };
            }
        }
    }])

'use strict';
angular.module('app').directive('appSheet', [function(){
  return {
    restrict: 'A',
    replace: true,
    scope: {
      list: '=',
      visible: '=',
      select: '&'
    },
    templateUrl: 'view/template/sheet.html'
  };
}]);

'use strict';
angular.module('app').directive('appTab', [function(){
  return {
    restrict: 'A',
    replace: true,
    scope: {
      list: '=',
      tabClick: '&'
    },
    templateUrl: 'view/template/tab.html',
    link: function($scope){
      $scope.click = function(tab){
        $scope.selectId = tab.id;
        $scope.tabClick(tab);
      }
    }
  };
}]);

    'use strict';
    angular.module('app').filter('filterByObj',[function(){
        return function(list,obj){
            var result = [];
            angular.forEach(list,function(item){
                var isEqual = true;
                for(var e in obj){
                    if(item[e]!==obj[e]){
                        isEqual = false;
                    }
                }
                if(isEqual){
                    result.push(item);
                }
            })
            return result;
        }
    }])

    'use strict';

    angular.module('app').service('cache',['$cookies',function($cookies){
        this.put = function(key,value){
            $cookies.put(key,value);
        };
        this.get = function(key){
            return $cookies.get(key);
        };
        this.remove = function(key){
            $cookies.remove(key);
        };
    }])
