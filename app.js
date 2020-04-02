const mapboxToken = "pk.eyJ1IjoiYXNoaXRvc2hwIiwiYSI6ImNpZ3JrczJqNTAyMTJ0N2tuMTIwcjN6bWkifQ.8T0Jk2N7xv1EDlyMzW5dpg";


mapboxgl.accessToken = mapboxToken;

var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/dark-v10',
zoom: 4,
center: [81.4470908,20.4408239]
});

function getInfectedColor(infectedCount){
  if (infectedCount >= 100){
    return "red";
  }
  
  if (infectedCount >= 20){
    return "orange";
  }

    return "grey";
}


fetch("get-data.json")
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
