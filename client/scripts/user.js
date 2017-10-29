// User Api
angular.module('dietPalApp').factory('userApi', function($http) {
  let getUser = () => {
    return $http.get("/user")
      .then(response => response.data)
  }

  let isLoggedIn = () => {
    return $http.get("/isAuth")
      .then(response => response.data);
  }

  let logOut = () => {
    return $http.post("/logout")
      .then(response => response.data);
  }

  return {getUser, isLoggedIn, logOut};
});