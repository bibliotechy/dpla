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
      L.geoJson($scope.shapes, {style : style, onEachFeature : onEachStateFeature }).addTo(map);
    })
  })
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
      info.update = function (props) {
        this._div.innerHTML = '<h4>DPLA Records By County in '+ $routeParams.state  +' </h4>' +  (props ?
          '<b>' + props.name + '</b><br />' + props.count + ' records'
        : 'Hover over a state');
      };
      L.geoJson($scope.shapes, {style : style, onEachFeature : onEachCountyFeature }).addTo(map);
    })
    $scope.params = $routeParams;
  })
}

function county($http, $scope, $routeParams){
  $http.jsonp('http://api.dp.la/v2/items?sourceResource.spatial.state=' + $routeParams.state + ' &sourceResource.spatial.county='+ $routeParams.county +'&page_size=100&callback=JSON_CALLBACK&api_key=9da474273d98c8dc3dc567939e89f9f8').success(function(data) {
    $scope.county = data;
    $scope.params = $routeParams;
    data.docs.forEach(function(doc){
        try {
          doc.sourceResource.spatial.forEach(function(el){
            var cs = el.coordinates.split(',');
            if(cs) {
              L.marker([cs[0],cs[1]]).addTo(map).bindPopup(doc.sourceResource.title);
            }
          }
          );
        }
        catch (e) {}
      });
    });
  };


function city($http, $scope, $routeParams){
  $http.jsonp('http://api.dp.la/v2/items?sourceResource.spatial.state=' + $routeParams.state + ' &sourceResource.spatial.county='+ $routeParams.city +'&page_size=10&callback=JSON_CALLBACK&api_key=9da474273d98c8dc3dc567939e89f9f8').success(function(data) {
    $scope.city = data;
    $scope.params = $routeParams;
  })
}



function style(feature) {
  return {
    fillColor: getColor(feature.properties.count, feature.properties.kind),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}

function getColor(count, kind) {
  var d = (kind != "county")? count/100 : count;
  return d > 500 ? '#321414' :
  d > 250  ? '#701C1C' :
  d > 100  ? '#b31b1b' :
  d > 50  ? '#CE1620' :
  d > 10   ? '#CD5C5C' :
  d > 5   ? '#FF1C00' :
  d > 1  ? '#FF6961' :
  '#FFFAFA';
}

function highlightFeature(e) {
    var layer = e.target;
      info.update(layer.feature.properties);
    }

function resetHighlight(e) {
    $scope.geojson.resetStyle(e.target);
}



function onEachCountyFeature(feature, layer) {
  layer.on({
    click     : CountyZoomLoad,
    mouseover : highlightFeature 
  });
}

function openPopup(e) {
  var j = e;
  e.layer.openPopup();
}


function onEachStateFeature(feature, layer) {
  layer.on({
    click     : StateZoomLoad,
    mouseover : highlightFeature 
  });
}
function StateZoomLoad(e) {
  map.fitBounds(e.target.getBounds());
  window.location.assign('/dpla/#/state/'+ escape(e.target.feature.properties.Name));
  legend.update(e.target.feature.properties);
}
function CountyZoomLoad(e) {
  map.fitBounds(e.target.getBounds());
  window.location.assign('/dpla/#/state/' +  escape(window.location.hash.split('/').slice(-1)[0]) +'/county/'+ escape(e.target.feature.properties.name));
}

var abbrev  ={"ALABAMA":"AL","ALASKA":"AK","AMERICAN SAMOA":"AS","ARIZONA":"AZ","ARKANSAS":"AR","CALIFORNIA":"CA","COLORADO":"CO","CONNECTICUT":"CT","DELAWARE":"DE","DISTRICT OF COLUMBIA":"DC","FEDERATED STATES OF MICRONESIA":"FM","FLORIDA":"FL","GEORGIA":"GA","GUAM":"GU","HAWAII":"HI","IDAHO":"ID","ILLINOIS":"IL","INDIANA":"IN","IOWA":"IA","KANSAS":"KS","KENTUCKY":"KY","LOUISIANA":"LA","MAINE":"ME","MARSHALL ISLANDS":"MH","MARYLAND":"MD","MASSACHUSETTS":"MA","MICHIGAN":"MI","MINNESOTA":"MN","MISSISSIPPI":"MS","MISSOURI":"MO","MONTANA":"MT","NEBRASKA":"NE","NEVADA":"NV","NEW HAMPSHIRE":"NH","NEW JERSEY":"NJ","NEW MEXICO":"NM","NEW YORK":"NY","NORTH CAROLINA":"NC","NORTH DAKOTA":"ND","NORTHERN MARIANA ISLANDS":"MP","OHIO":"OH","OKLAHOMA":"OK","OREGON":"OR","PALAU":"PW","PENNSYLVANIA":"PA","PUERTO RICO":"PR","RHODE ISLAND":"RI","SOUTH CAROLINA":"SC","SOUTH DAKOTA":"SD","TENNESSEE":"TN","TEXAS":"TX","UTAH":"UT","VERMONT":"VT","VIRGIN ISLANDS":"VI","VIRGINIA":"VA","WASHINGTON":"WA","WEST VIRGINIA":"WV","WISCONSIN":"WI","WYOMING":"WY"};
