// Wrapper for entries Api from server
angular.module('dietPalApp').factory('entriesApi', function($http) {
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