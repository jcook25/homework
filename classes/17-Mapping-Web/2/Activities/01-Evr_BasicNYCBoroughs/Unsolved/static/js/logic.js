var map = createMap();
addBaseLayer(map);
createBorough(map);
/**********************************************/
function createMap() {
  // Creating map object
  var map = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 11
  });
  return map;
}
/**********************************************/
function addBaseLayer(map) {
  // Adding tile layer
  var base = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });
  base.addTo(map);
}
/**********************************************/
function createBorough(map) {
  // Uncomment this link local geojson for when data.beta.nyc is down
  var link = "static/data/nyc.geojson";
  d3.json(link).then(function (data) {
    var borough  = L.geoJson(data, 
      {
        style : mapStyle,
        onEachFeature: mapFeature,
      })
    borough.addTo(map)
  });
}
/**********************************************/
function mapStyle(feature )
{
  // console.log(feature)
  return {
    color: "white",
    fillColor: color(feature.properties.borough),
    fillOpacity: 0.5,
    weight: 1.5
  };
}
/**********************************************/
function color(borough) {
  switch (borough) {
    case "Brooklyn": return "yellow";
    case "Bronx": return "red";
    case "Manhattan": return "orange";
    case "Queens": return "green";
    case "Staten Island": return "purple";
    default: return "black";
  }
}
/**********************************************/
function mapFeature(feature , layer)
{
  // console.log("mapFeature")
  layer.on({
    // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
    mouseover: function(event) {
      layer = event.target;
      layer.setStyle({
        fillOpacity: 0.9
      });
    },
    // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
    mouseout: function(event) {
      layer = event.target;
      layer.setStyle({
        fillOpacity: 0.5
      });
    },
    // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
    click: function(event) {
      map.fitBounds(event.target.getBounds());
    }
  });
  // Giving each feature a pop-up with information pertinent to it
  layer.bindPopup("<h1>" + feature.properties.neighborhood + "</h1> <hr> <h2>" + feature.properties.borough + "</h2>");
}