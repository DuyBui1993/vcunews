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
