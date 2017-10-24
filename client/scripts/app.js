var app = angular.module('dietPalApp', []);

app.controller('mainController', function($scope, $http, entriesApi) {

    $scope.entryValue = "";
    $scope.data = {};

    $scope.fetchData = () => {
      entriesApi.getEntries()
        .then(function(data) {
            $scope.data = data;
        });
    }

    $scope.addEntry = () => entriesApi.addEntry($scope.entryValue)
      .then(() => $scope.fetchData());

    $scope.fetchData();
});

app.factory('entriesApi', function($http) {
    let getEntries = () => {
      return $http.get("/entries")
        .then(response => response.data);
    };

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