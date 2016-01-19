var map;

var locations = [{
  address: "3240 Prairie Avenue, Boulder, CO 80301",
  title: 'The Spot Bouldering Gym'
},
{
  address: "825 Walnut Street, Boulder CO, 80302",
  title: 'Sherpa\'s Restaurant'
},
{
  address: "1117 Pearl Street, Boulder, CO 80302",
  title: 'Hapa Sushi'
},
{
  address: "40.014290, -105.282472",
  title: 'Boulder Creek'
},
{
  address: "1111 Engineering Dr, Boulder, CO 80309",
  title: 'The CU Engineering Center'
}];

locations.forEach((loc)=>{
//  var url = 'https://api.yelp.com/v2/search?term=' + loc.title + '&location=Boulder,+Colorado';
  var url = 'https://api.yelp.com/v2/search/?term=donuts&location=boulder?oauth_consumer_key=4NSfQz0B0AcatVl7p2CVQA&oauth_nonce=414253690&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1453243884&oauth_token=QTEdTYBzg1dlfzUstVI6dFk4XJs&oauth_signature=7hjqTrru27Nr52PiDCdLUxENvhE%3D';
  fetch(url).then((res)=>{
    console.log(res);
  })
})

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.02, lng: -105.27},
    zoom: 14
  });
  

  locations.forEach((loc) => {
    var latlng;
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + loc.address;
    fetch(url).then((response)=>{
      response.json().then((json)=>{
        latlng = json.results[0].geometry.location;
        
        var marker = new google.maps.Marker({
          position: latlng,
          animation: google.maps.Animation.DROP,
          label: loc.title,
          title: loc.title
        });
        marker.setMap(map);
        var infowindow = new google.maps.InfoWindow({
          content: loc.title
        });

        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });

    })});
  });
}


