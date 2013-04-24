'use strict';

/* Controllers */

function myFunc(data) {
  
}

function allStates($http, $scope) {
  $http.jsonp('http://api.dp.la/v2/items?sourceResource.spatial.country=United+States&page_size=0&facets=sourceResource.spatial.state&callback=JSON_CALLBACK&api_key=9da474273d98c8dc3dc567939e89f9f8').success(function(data) {
    $scope.states = data;
    $scope.obj = {};
    data.facets['sourceResource.spatial.state'].terms.forEach(function(el) {$scope.obj[el.term] = el.count});
  })
}

function state($http, $scope, $routeParams){
  $http.jsonp('http://api.dp.la/v2/items?sourceResource.spatial.state=' + $routeParams.state + " &page_size=0&facets=sourceResource.spatial.county,sourceResource.spatial.city&callback=JSON_CALLBACK&api_key=9da474273d98c8dc3dc567939e89f9f8").success(function(data) {
    $scope.state = data;
  })
}

/*
angular.module('myApp.controllers', []).
  controller('allStates', [function($scope, $http) {
    $http.jsonp('http://api.dp.la/v2/items?sourceResource.spatial.country=United+States&page_size=0&facets=sourceResource.spatial.state&callback=myFunc&api_key=9da474273d98c8dc3dc567939e89f9f8', function(date) {
      $scope.states = data;
    })
    $scope.orderProp = 'term';
  }])
  .controller('MyCtrl2', [function() {

  }]);
  */
