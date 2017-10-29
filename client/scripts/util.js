// Reverse Filter
angular.module('dietPalApp').filter('reverse', function() {
  return function(items) {
    if(!Array.isArray(items)) return [];
    return items.slice().reverse();
  };
});