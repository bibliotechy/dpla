'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp',[] ).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/partial1.html', controller: allStates});
    $routeProvider.when('/state/:state', {templateUrl: 'partials/partial2.html', controller: state});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
