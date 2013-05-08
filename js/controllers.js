'use strict';

/* Controllers */

function allStates($http, $scope) {
  $http.jsonp('http://api.dp.la/v2/items?sourceResource.spatial.country=United+States&page_size=0&facets=sourceResource.spatial.state&callback=JSON_CALLBACK&api_key=9da474273d98c8dc3dc567939e89f9f8').success(function(data) {
    $http.get('data/states.js').success(function(state_data) {
    $scope.shapes = state_data;
    $scope.states = data;
    var obj = {};
    data.facets['sourceResource.spatial.state'].terms.forEach(function(el) { obj[el.term] = el.count});
    $scope.shapes.features.forEach(function(feature, index){feature.properties.count = obj[feature.properties.Name]; });
L.geoJson($scope.shapes, {style : style, onEachFeature : onEachFeature }).addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 500, 1000, 3000, 5000, 10000, 25000, 50000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = grades.length; i > 0; i--) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i -1] ) + '"></i> ' +
            (grades[i]?  grades[i - 1]/1000 + 'k &ndash;' + grades[i]/1000 + 'k<br>' : grades[i - 1] + '+<br>');
    }

    return div;
};

legend.addTo(map);

})
  })
}

function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    $scope.geojson.resetStyle(e.target);
}

function getColor(d) {
  return d > 50000 ? '#800026' :
  d > 1000  ? '#BD0026' :
  d > 500  ? '#E31A1C' :
  d > 300  ? '#FC4E2A' :
  d > 100   ? '#FD8D3C' :
  d > 50   ? '#FEB24C' :
  d > 10   ? '#FED976' :
  '#BADA55';
}

function style(feature) {
  return {
    fillColor: getColor(feature.properties.count),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}

function onEachFeature(feature, layer) {
  layer.bindPopup(feature.properties.Name);
  layer.on({
    click     : zoomLoad
  });
}

function zoomLoad(e) {
  map.fitBounds(e.target.getBounds());
  window.location.assign('/dpla/#/state/'+ escape(e.target.feature.properties.Name));
}

function state($http, $scope, $routeParams){
  $http.jsonp('http://api.dp.la/v2/items?sourceResource.spatial.state=' + $routeParams.state + " &page_size=0&facets=sourceResource.spatial.county,sourceResource.spatial.city&callback=JSON_CALLBACK&api_key=9da474273d98c8dc3dc567939e89f9f8").success(function(data) {
    var ab = abbrev[$routeParams.state.toUpperCase()]
    $http.get('data/' + ab + '.js').success(function(county_data) {
   $scope.shapes = county_data; 
   $scope.state = data;
   var obj = {};
   data.facets['sourceResource.spatial.county'].terms.forEach(function(el) {obj[el.term.split(' ').slice(0,-1).join(' ')] = el.count});
   $scope.shapes.features.forEach(function(feature, index){feature.properties.count = obj[feature.properties.name]; });
   L.geoJson($scope.shapes, {style : style, onEachFeature : onEachFeature }).addTo(map);

   })
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

var abbrev  ={"ALABAMA":"AL","ALASKA":"AK","AMERICAN SAMOA":"AS","ARIZONA":"AZ","ARKANSAS":"AR","CALIFORNIA":"CA","COLORADO":"CO","CONNECTICUT":"CT","DELAWARE":"DE","DISTRICT OF COLUMBIA":"DC","FEDERATED STATES OF MICRONESIA":"FM","FLORIDA":"FL","GEORGIA":"GA","GUAM":"GU","HAWAII":"HI","IDAHO":"ID","ILLINOIS":"IL","INDIANA":"IN","IOWA":"IA","KANSAS":"KS","KENTUCKY":"KY","LOUISIANA":"LA","MAINE":"ME","MARSHALL ISLANDS":"MH","MARYLAND":"MD","MASSACHUSETTS":"MA","MICHIGAN":"MI","MINNESOTA":"MN","MISSISSIPPI":"MS","MISSOURI":"MO","MONTANA":"MT","NEBRASKA":"NE","NEVADA":"NV","NEW HAMPSHIRE":"NH","NEW JERSEY":"NJ","NEW MEXICO":"NM","NEW YORK":"NY","NORTH CAROLINA":"NC","NORTH DAKOTA":"ND","NORTHERN MARIANA ISLANDS":"MP","OHIO":"OH","OKLAHOMA":"OK","OREGON":"OR","PALAU":"PW","PENNSYLVANIA":"PA","PUERTO RICO":"PR","RHODE ISLAND":"RI","SOUTH CAROLINA":"SC","SOUTH DAKOTA":"SD","TENNESSEE":"TN","TEXAS":"TX","UTAH":"UT","VERMONT":"VT","VIRGIN ISLANDS":"VI","VIRGINIA":"VA","WASHINGTON":"WA","WEST VIRGINIA":"WV","WISCONSIN":"WI","WYOMING":"WY"};
