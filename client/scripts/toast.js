// Toast Api
angular.module('dietPalApp').factory('toastApi', function($mdToast) {
  // Toast Section
  let last = {
    bottom: true,
    top: false,
    left: false,
    right: true
  };

  let toastPosition = angular.extend({},last);

  let showSimpleToast = function(content = 'Nice! We are tracking it!') {
    let pinTo = getToastPosition();
    $mdToast.show(
      $mdToast.simple()
        .textContent(content)
        .position(pinTo)
        .hideDelay(3000)
    );
  };

  let getToastPosition = function() {
    sanitizePosition();
    return Object.keys(toastPosition)
      .filter(function(pos) { return toastPosition[pos]; })
      .join(' ');
  };

  let sanitizePosition = () => {
    let current = toastPosition;
    if ( current.bottom && last.top ) current.top = false;
    if ( current.top && last.bottom ) current.bottom = false;
    if ( current.right && last.left ) current.left = false;
    if ( current.left && last.right ) current.right = false;
    last = angular.extend({},current);
  }

  return {showSimpleToast};
});