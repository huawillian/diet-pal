var app = angular.module('dietPalApp', ['ngMaterial']);

// Theme app
app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('light-green')
    .dark(); 
});

// Controller for app
app.controller('mainController', function($scope, $http, entriesApi, $mdToast) {
    $scope.entryValue = "";
    $scope.data = {};

    let ctx = angular.element(document.getElementById("myChart").getContext('2d'));

    $scope.fetchData = () => {
      entriesApi.getEntries()
        .then(function(data) {
            $scope.data = data.sort((a,b) => a.date < b.date).slice(0, 10).reverse();
            $scope.updateLineGraph();
        });
    }

    $scope.updateLineGraph = () => {
      let myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: $scope.data.filter(o => !!o.weight).map(o => o.date),
          datasets: [{
            label: 'weight (lbs)',
            data: $scope.data.filter(o => !!o.weight).map(o => o.weight),
          }]
          }
        });
    }

    $scope.addEntry = () => {
      entriesApi.addEntry($scope.entryValue)
      .then(() => {
        $scope.entryValue = "";
        $scope.showSimpleToast();
        return $scope.fetchData();
      });
    };

    $scope.fetchData();


    // Toast Section
    let last = {
      bottom: true,
      top: false,
      left: false,
      right: true
    };

    $scope.toastPosition = angular.extend({},last);

    $scope.showSimpleToast = function() {
      let pinTo = $scope.getToastPosition();
      $mdToast.show(
        $mdToast.simple()
          .textContent('Nice! We are tracking it!')
          .position(pinTo)
          .hideDelay(3000)
      );
    };

    $scope.getToastPosition = function() {
      sanitizePosition();
      return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    let sanitizePosition = () => {
      let current = $scope.toastPosition;
      if ( current.bottom && last.top ) current.top = false;
      if ( current.top && last.bottom ) current.bottom = false;
      if ( current.right && last.left ) current.left = false;
      if ( current.left && last.right ) current.right = false;
      last = angular.extend({},current);
    }
});

// Wrapper for entries Api from server
app.factory('entriesApi', function($http) {
    // Get Entries
    let getEntries = () => {
      return $http.get("/entries")
        .then(response => response.data);
    };

    // Post to entries given a value, determine weight or food to track
    let addEntry = (val) => {
      let data = {};
      if(parseFloat(val)) {
        data.weight = parseFloat(val);
      } else {
        data.food = val;
      }
      return $http({
          method: 'POST',
          url: "/entries",
          data: JSON.stringify(data)
        })
        .then(response => response.data); 
    };

    return {getEntries, addEntry};
});

// Reverse Filter
app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});