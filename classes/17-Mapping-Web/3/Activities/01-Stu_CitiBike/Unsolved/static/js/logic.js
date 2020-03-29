var newYorkCoords = [40.73, -74.0059];
var mapZoomLevel = 12;
var infourl = "https://gbfs.citibikenyc.com/gbfs/en/station_information.json";
var statusurl = "https://gbfs.citibikenyc.com/gbfs/en/station_status.json"

/**********************************************/
d3.json(infourl).then(info => {
  d3.json(statusurl).then(status => BikeMap(info, status))
})

/**********************************************/

function BikeMap(stationInfo, stationStatus) {
  var myMap = MapObject();
  var baseLayers = createBaseLayers()
  var legend = createLegend();
  var icons = createIcons();
  var layers = createLayerGroups();
  var overlayMaps = createOverlayMaps(layers);
  //start adding the controls and layers to the map
  
  myMap.addControl(legend);
  
  myMap.addLayer(baseLayers["Street Map"])

  var controls = L.control.layers(baseLayers, overlayMaps, {
    collapsed: true,
    position: "topright"
  });
  myMap.addControl(controls)

  //add each layergroup now
  Object.values(layers).forEach(layer => {
    layer.addTo(myMap)
  });

  var updatedAt = stationInfo.last_updated;
  var statusData = stationStatus.data.stations;
  var InfoData = stationInfo.data.stations;
  var stationCount = {
    COMING_SOON: 0,
    EMPTY: 0,
    LOW: 0,
    NORMAL: 0,
    OUT_OF_ORDER: 0
  };

  for (var index = 0; index < statusData.length; index++) {
   // if (index > 1) break;
    var info = InfoData[index]
    var status = statusData[index]
    var station = Object.assign({}, info, status);
    var statuscode = getStationStatus(station)
    stationCount[statuscode]++;
    // Create a new marker with the appropriate icon and coordinates
    var newMarker = getMarker(station, statuscode, icons);
    // Add the new marker to the appropriate layer
    newMarker.addTo(layers[statuscode]);
    //layers[stationStatus].addLayer(newMarker);
  }
  updateLegend(updatedAt ,stationCount)
}

/**********************************************/

/**********************************************/
function MapObject() {
  var map = L.map("map-id", {
    center: newYorkCoords,
    zoom: mapZoomLevel
  });
  return map;
}

/**********************************************/

function createBaseLayers() {
  //API url
  urltemplate = "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}";

  /* This is the list of base layers that we are adding to the map. 
  This will appear on the control list, where user will be able to select only 
  one of them at a time
  */
  var mapids = {
    "Street Map": "mapbox.streets",
    "Dark Map": "mapbox.dark",
    "Satellite": "mapbox.satellite",
    "Satellite Street": "mapbox.streets-satellite",
    "Light": "mapbox.light",
    "Wheatpaste": "mapbox.wheatpaste",
    "Comic": "mapbox.comic",
    "pencil": "mapbox.pencil",
    "Emerald": "mapbox.emerald",
    "Pirates": "mapbox.pirates"
  }

  /* This is function defined inside this funciton and it will be used later on to
    when we add each layer to the baseMaps object
  */
  function basemap(baselayer) {
    return {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      "maxZoom": 18,
      "id": baselayer,
      "accessToken": API_KEY
    }
  }

  var baseMaps = {}
  for (key in mapids) {
    baseMaps[key] = L.tileLayer(urltemplate, basemap(mapids[key]));
  }

  return baseMaps;
}

/****************************************************************/

function createIcons() {
  // Initialize an object containing icons for each layer group
  var icons = {
    COMING_SOON: L.ExtraMarkers.icon({
      icon: "ion-settings",
      iconColor: "white",
      markerColor: "yellow",
      shape: "star"
    }),
    EMPTY: L.ExtraMarkers.icon({
      icon: "ion-android-bicycle",
      iconColor: "white",
      markerColor: "red",
      shape: "circle"
    }),
    OUT_OF_ORDER: L.ExtraMarkers.icon({
      icon: "ion-minus-circled",
      iconColor: "white",
      markerColor: "blue-dark",
      shape: "penta"
    }),
    LOW: L.ExtraMarkers.icon({
      icon: "ion-android-bicycle",
      iconColor: "white",
      markerColor: "orange",
      shape: "circle"
    }),
    NORMAL: L.ExtraMarkers.icon({
      icon: "ion-android-bicycle",
      iconColor: "white",
      markerColor: "green",
      shape: "circle"
    })
  };

  return icons;
}

/****************************************************************/
function createLegend() {
  var legend = L.control({
    position: "bottomleft"
  });
  // When the layer control is added, insert a div with the class of "legend"
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };
  return legend;
}

/****************************************************************/
function createLayerGroups() {
  // Initialize all of the LayerGroups we'll be using
  var layers = {
    COMING_SOON: new L.LayerGroup(),
    EMPTY: new L.LayerGroup(),
    LOW: new L.LayerGroup(),
    NORMAL: new L.LayerGroup(),
    OUT_OF_ORDER: new L.LayerGroup()
  };
  return layers;
}

/***************************************************************/

function createOverlayMaps(layers) {
  var overlays = {
    "Coming Soon": layers.COMING_SOON,
    "Empty Stations": layers.EMPTY,
    "Low Stations": layers.LOW,
    "Healthy Stations": layers.NORMAL,
    "Out of Order": layers.OUT_OF_ORDER
  };
  return overlays;
}

/***************************************************************/

function getStationStatus(station) {
  if (!station.is_installed) {
    stationStatusCode = "COMING_SOON";
  }
  // If a station has no bikes available, it's empty
  else if (!station.num_bikes_available) {
    stationStatusCode = "EMPTY";
  }
  // If a station is installed but isn't renting, it's out of order
  else if (station.is_installed && !station.is_renting) {
    stationStatusCode = "OUT_OF_ORDER";
  }
  // If a station has less than 5 bikes, it's status is low
  else if (station.num_bikes_available < 5) {
    stationStatusCode = "LOW";
  }
  // Otherwise the station is normal
  else {
    stationStatusCode = "NORMAL";
  }
  return stationStatusCode;
}

/*****************************************************************/

function getMarker(station, stationStatus, icons) {

  var marker = L.marker([station.lat, station.lon],
    { icon: icons[stationStatus] }
  );
  // Bind a popup to the marker that will  display on click. This will be rendered as HTML
  var popuptext = station.name + "<br> Capacity: " +
    station.capacity + "<br>" +
    station.num_bikes_available + " Bikes Available"

  marker.bindPopup(popuptext);
  return marker;
}

/*****************************************************************/
function updateLegend(time, stationCount) {
  legend = d3.select(".legend");
  var html = [
    "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
    "<p class='out-of-order'>Out of Order Stations: " + stationCount.OUT_OF_ORDER + "</p>",
    "<p class='coming-soon'>Stations Coming Soon: " + stationCount.COMING_SOON + "</p>",
    "<p class='empty'>Empty Stations: " + stationCount.EMPTY + "</p>",
    "<p class='low'>Low Stations: " + stationCount.LOW + "</p>",
    "<p class='healthy'>Healthy Stations: " + stationCount.NORMAL + "</p>"
  ].join("");
  legend.html(html);
}
/***************************************************************/