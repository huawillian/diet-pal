var app = angular.module('dietPalApp', ['ngMaterial', 'ngRoute']);

// Theme app
app.config(function($mdThemingProvider, $routeProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('light-green')
    .dark(); 
  $routeProvider
    .when("/", {
        templateUrl : "templates/main.html",
        controller: "mainController"
    })
    .when("/login", {
        templateUrl : "templates/login.html",
    })
    .when("/signup", {
        templateUrl : "templates/signup.html",
    })
    .otherwise({
      redirectTo: "/"
    });
});

// Controller for app
app.controller('controller', function($scope, $http, entriesApi, toastApi, userApi) {
  //userApi.getUser().then(result => console.log(result));
});