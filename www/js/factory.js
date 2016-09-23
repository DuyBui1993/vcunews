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
