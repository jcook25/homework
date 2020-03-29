var center = [33.963183, -84.220817]
var myMap = L.map("map" ,{
    center : center,
    zoom : 13
})
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

var marker = L.marker(center, {
    draggable: true,
    title: "My First Marker"
  }).addTo(myMap);

  // Binding a pop-up to our marker
  marker.bindPopup("Hello There!");

  var cities = [{
    location: [40.7128, -74.0059],
    name: "New York",
    population: "8,550,405"
  },
  {
    location: [41.8781, -87.6298],
    name: "Chicago",
    population: "2,720,546"
  },
  {
    location: [29.7604, -95.3698],
    name: "Houston",
    population: "2,296,224"
  },
  {
    location: [34.0522, -118.2437],
    name: "Los Angeles",
    population: "3,971,883"
  },
  {
    location: [41.2524, -95.9980],
    name: "Omaha",
    population: "446,599"
  }
  ];