'use strict';

/* Controllers */

function myFunc(data) {
  
}

function allStates($http, $scope) {
  $http.jsonp('http://api.dp.la/v2/items?sourceResource.spatial.country=United+States&page_size=0&facets=sourceResource.spatial.state&callback=JSON_CALLBACK&api_key=9da474273d98c8dc3dc567939e89f9f8').success(function(data) {
        function getColor(d) {
    return d > 10000 ? '#800026' :
           d > 5000  ? '#BD0026' :
           d > 2000  ? '#E31A1C' :
           d > 1000  ? '#FC4E2A' :
           d > 500   ? '#FD8D3C' :
           d > 200   ? '#FEB24C' :
           d > 100   ? '#FED976' :
                      '#BADA55';
}

function style(feature) {
    //console.log(feature);
    return {
      fillColor: getColor(feature.properties.count),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}    
    $http.get('data/states.js').success(function(state_data) {
    $scope.shapes = state_data;
    $scope.states = data;
    var obj = {};
    data.facets['sourceResource.spatial.state'].terms.forEach(function(el) { obj[el.term] = el.count});
    $scope.shapes.features.forEach(function(feature, index){$scope.shapes.features[index].properties.count = obj[feature.properties.Name]; console.log(feature.properties.Name); });
    L.geoJson($scope.shapes, {style : style}).addTo(map);
    })



})
}

function state($http, $scope, $routeParams){
  $http.jsonp('http://api.dp.la/v2/items?sourceResource.spatial.state=' + $routeParams.state + " &page_size=0&facets=sourceResource.spatial.county,sourceResource.spatial.city&callback=JSON_CALLBACK&api_key=9da474273d98c8dc3dc567939e89f9f8").success(function(data) {
    $scope.state = data;
    $scope.params = $routeParams;
  })
}

function county($http, $scope, $routeParams){
  $http.jsonp('http://api.dp.la/v2/items?sourceResource.spatial.state=' + $routeParams.state + ' &sourceResource.spatial.county='+ $routeParams.county +'&page_size=10&callback=JSON_CALLBACK&api_key=9da474273d98c8dc3dc567939e89f9f8').success(function(data) {
    $scope.county = data;
    $scope.params = $routeParams;
  })
}

function city($http, $scope, $routeParams){
  $http.jsonp('http://api.dp.la/v2/items?sourceResource.spatial.state=' + $routeParams.state + ' &sourceResource.spatial.county='+ $routeParams.city +'&page_size=10&callback=JSON_CALLBACK&api_key=9da474273d98c8dc3dc567939e89f9f8').success(function(data) {
    $scope.city = data;
    $scope.params = $routeParams;
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
