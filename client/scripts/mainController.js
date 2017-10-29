// Controller for app
angular.module('dietPalApp').controller('mainController', function($scope, $http, entriesApi, toastApi, userApi) {
  $scope.entryValue = "";
  $scope.data = {};
  $scope.user = null;

  let element = angular.element(document.getElementById("myChart"));

  let ctx = Object.keys(element).length > 0 ? angular.element(document.getElementById("myChart").getContext('2d')) : false;

  $scope.fetchData = () => {
    entriesApi.getEntries()
      .then(function(data) {
          $scope.data = data.sort((a,b) => a.date < b.date).slice(0, 10).reverse();
          ctx && $scope.updateLineGraph();
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
  $scope.showSimpleToast = toastApi.showSimpleToast;
  userApi.getUser().then(result => $scope.user = result);
});