// Define the URL for the earthquake data.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a new Leaflet map.
let myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 2,
});

// Create a tile layer for the base map.
let streetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors",
}).addTo(myMap);

// Use D3 to load the earthquake data.
d3.json(queryUrl).then(function (data) {
  // Create a GeoJSON layer for the earthquake data.
  let earthquakes = L.geoJSON(data, {
    onEachFeature: function (feature, layer) {
      layer.bindTooltip(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p><p>${new Date(feature.properties.time)}</p>`, {
        sticky: true,
        direction: 'top'
     
    });
},
    pointToLayer: function (feature, latlng) {
      let magnitude = feature.properties.mag;
      let fillColor = magnitude > 5 ? "#8B0000" : magnitude > 4 ? "#FF4500" : magnitude > 3 ? "#FF8C00" : magnitude > 2 ? "#FFA500" : magnitude > 1 ? "#FFFF00" : "#7FFF00";
      return L.circleMarker(latlng, {
        radius: magnitude * 3,
        fillColor: fillColor,
        color: "#000000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      });
    },
  }).addTo(myMap);
});
// Create a legend control object
let legend = L.control({ position: "bottomright" });

// Add the legend to the map
legend.onAdd = function(myMap) {

  // Create a new HTML element to use as our legend
  let div = L.DomUtil.create("div", "info legend");

  // Define the color scale for our legend
  let grades = [-10, 10, 30, 50, 70, 90];
  let colors = ["#7FFF00", "#FFFF00", "#FFA500", "#FF8C00", "#FF4500", "#8B0000"];
  let labels = []

  // Loop through our intervals and generate a label with a colored square for each interval
  for (let i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colors[i] + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

// Add the legend to the map
legend.addTo(myMap);
