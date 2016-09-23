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
