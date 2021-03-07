// Map Box

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/dark-v10", // style URL
//   style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: place.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});


new mapboxgl.Marker().setLngLat( place.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset:25}).setHTML(`<h4>${place.title}</h4> <p>${place.location}</p> <h5 style='line-break: anywhere;'>${place.description.substring(0,50)}...</h5>
  <h5> Lng: ${place.geometry.coordinates[0] } Lat:${place.geometry.coordinates[1]}</h5>`))
.addTo(map)