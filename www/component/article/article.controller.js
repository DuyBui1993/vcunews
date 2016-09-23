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
