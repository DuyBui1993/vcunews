// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('vcuApp', ['ionic', 'angularMoment', 'ngCordova'])

.run(['$ionicPlatform','amMoment',function($ionicPlatform, amMoment) {
    amMoment.changeLocale('vi');
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  }])

.config(['$stateProvider','$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home.template.html',
      controller: 'HomeController'
    })
    .state('articles', {
      url: '/articles',
      templateUrl: 'article.template.html',
      controller: 'ArticleController'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'login.template.html',
      controller: 'LoginController'
    })
    .state('battery', {
      url: '/battery',
      templateUrl: 'battery.template.html',
      controller: 'BatteryController'
    });
  $urlRouterProvider.otherwise('/');
}])

.factory('RSSLoader',['$http', function($http) {
    // Google feed api to bypass cors
    var googleFeed = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=";
    var url = "http://vcunews.com/";

    return {
      getByCategoryNextPage: function(category, page) {
        return $http.jsonp(googleFeed + encodeURIComponent(url + category + "?paged=" + page));
      },
      resetPage: function() {
        categoryPage = {}
      }
    }
  }])
.factory('ArticleHolder', function() {
  var obj = { feed: null };
  return obj;
})
.service('LoginService',['$q', function($q) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            if (name == 'admin' && pw == '1234') {
                deferred.resolve('Welcome ' + name + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
}])

.controller("ArticleController", ['$scope', 'RSSLoader', '$http', '$state','ArticleHolder',
 function($scope, RSSLoader, $http, $state, ArticleHolder) {
  $scope.feed = ArticleHolder.feed;

  $scope.backHome = function() {
    $state.go('home');
  }

  $scope.share = function() {
    $state.go('share');
  }
}])

.controller("BatteryController",['$scope', '$rootScope', '$ionicPlatform', '$cordovaBatteryStatus',
   function($scope, $rootScope, $ionicPlatform, $cordovaBatteryStatus) {
    $scope.isPlugged = false;
    $scope.batteryLevel = 0;
    $ionicPlatform.ready(function() {
        $rootScope.$on("$cordovaBatteryStatus:status", function(event, args) {
            $scope.isPlugged = args.isPlugged;
            $scope.batteryLevel = args.level;
            if(args.isPlugged) {
                alert("Charging -> " + args.level + "%");
            } else {
                alert("Battery -> " + args.level + "%");
            }
        });
    });

}])

.controller("HomeController", ['$scope', 'RSSLoader', '$http', '$state', 'ArticleHolder', '$ionicSideMenuDelegate',
 function($scope, RSSLoader, $http, $state, ArticleHolder, $ionicSideMenuDelegate) {
  var category = "feed";
  $scope.feeds = [];
  $scope.moreDataCanBeLoaded = true;
  var page = 1;

  // Parse and add to list
  function useItems(response) {
    var mainFeed = response.responseData;
    if (mainFeed != null) {
      var dataLoadMore = mainFeed.feed.entries.map(function(item) {
        item.publishedDate = moment(item.publishedDate);
        item.imageSrc = $('img', item.content)[0] != null ? $('img', item.content)[0].src : ''; // get first image of rss
        return item;
      })
      $scope.feeds = $scope.feeds.concat(dataLoadMore);
    } else {
      $scope.moreDataCanBeLoaded = false;
    }
  }
  // Load more item in list
  $scope.loadMore = function() {
    RSSLoader.getByCategoryNextPage(category,page).success(function(items) {
      useItems(items);
      page += 1;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  // View detail article
  $scope.viewArticle = function(feed) {
    ArticleHolder.feed = feed;
    $state.go('articles');
  }

  // Toggle sidemenu
  $scope.toggleLeftMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  }

  // Login
  $scope.login = function() {
    $state.go('login');
  }

  // Battery
  $scope.battery = function() {
    $state.go('battery');
  }
}])

.controller('LoginController',['$scope', 'LoginService', '$ionicPopup', '$state',
      function($scope, LoginService, $ionicPopup, $state) {
    $scope.data = {};

    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
          var alertPopup = $ionicPopup.alert({
              title: 'Login success!'s,
              template: 'Redirect to homepage...'
          });
            $state.go('home');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }
}])
