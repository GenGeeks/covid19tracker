const mapboxToken = "pk.eyJ1IjoiYXNoaXRvc2hwIiwiYSI6ImNpZ3JrczJqNTAyMTJ0N2tuMTIwcjN6bWkifQ.8T0Jk2N7xv1EDlyMzW5dpg";
mapboxgl.accessToken = mapboxToken;

var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
zoom: 4,
center: [81.4470908,20.4408239]
});

var draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
  polygon: true,
  trash: true
  }
  });

map.addControl(draw);

function getInfectedColor(infectedCount){
  if (infectedCount >= 100){
    return "red";
  }
  
  if (infectedCount >= 20){
    return "orange";
  }

    return "grey";
}

function showLockdownAreas(){
  map.zoom
  fetch("https://gengeeks.github.io/covid19tracker/lockdown-buildings.geojson")
  .then(response => response.json())
  .then(data => {     
      map.flyTo({
        center: [
          72.87613,19.19687
        ],
        zoom: 16,
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
      map.addSource('lockdown', {
        'type': 'geojson',
        'data': data
        });

      map.addLayer({
          'id': 'lockdown',
          'type': 'fill',
          'source': 'lockdown',
          'layout': {},
          'paint': {
          'fill-color': 'red',
          'fill-opacity': 0.3
          }
      });

      map.on('click', 'lockdown', function(e) {
        new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          '<strong>' + e.features[0].properties.name + '</strong> <br /> <br /> Total Active Cases: ' + e.features[0].properties.activecases + ' <br /> Lockdown Start Date: ' + e.features[0].properties.Lockdown_Start_Date + ' <br /> Lockdown End Date: ' + e.features[0].properties.Lockdown_End_Date
          )
        .addTo(map);
        });
        
        // Change the cursor to a pointer when the mouse is over the states layer.
        map.on('mouseenter', 'states-layer', function() {
        map.getCanvas().style.cursor = 'pointer';
        });
        
        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'states-layer', function() {
        map.getCanvas().style.cursor = '';
        });


  });
}

fetch("https://gengeeks.github.io/covid19tracker/get-data.json")
.then(response => response.json())
.then(data => {
    //console.log(data);
    const cases = data.data;

    

        
    cases.forEach(function (case1) {
      //console.log(case1.name + "," + case1.infected);
      var dateString = case1.lastUpdated;
      var lastUpdated = new Date(dateString);
      var popup = new mapboxgl.Popup({ 
        offset: 25 
      })
      .setHTML(
        '<strong>' + case1.name + '</strong> <br /> <br /> Infected: ' + case1.infected + ' <br /> Sick: ' + case1.sick + ' <br /> Dead: ' + case1.dead + ' <br /> Recovered: ' + case1.recovered
        );
      new mapboxgl.Marker({              
        color: getInfectedColor(case1.infected)
      })
      .setLngLat([case1.longitude,case1.latitude])
      .setPopup(popup)
      .addTo(map);

    });


});


// Load Polygon Geojson

