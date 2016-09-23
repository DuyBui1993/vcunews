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
