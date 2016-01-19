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
        
        yelpFetch(loc.title, 'Boulder')

    })});
  });
};

//******************* OAuth Fun *****************
//***********************************************
// From this very helpful gist : https://gist.github.com/kennygfunk/c24c8a2ea71c9ce7f4fc

function yelpFetch(term, location){

  var auth = {
    consumerKey : "4NSfQz0B0AcatVl7p2CVQA",
    consumerSecret : "oGXlKX8vymwdBBx6khM8kij6G-U",
    accessToken : "QTEdTYBzg1dlfzUstVI6dFk4XJs",
    // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
    // You wouldn't actually want to expose your access token secret like this in a real application.
    accessTokenSecret : "bku8a5nlw5zSPs_sUdeNlF3ou8M",
    serviceProvider : {
      signatureMethod : "HMAC-SHA1"
    }
  };

  var accessor = {
    consumerSecret : auth.consumerSecret,
    tokenSecret : auth.accessTokenSecret
  };

  var parameters = [];
  parameters.push(['term', term]);
  parameters.push(['location', location]);
  parameters.push(['callback', 'cb']);
  parameters.push(['oauth_consumer_key', auth.consumerKey]);
  parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  parameters.push(['oauth_token', auth.accessToken]);
  parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
  
  var message = {
    'action' : 'http://api.yelp.com/v2/search',
    'method' : 'GET',
    'parameters' : parameters
  };
  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);
  
  var parameterMap = OAuth.getParameterMap(message.parameters);
  parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
  console.log(parameterMap);
  
        $.ajax({
        'url' : message.action,
        'data' : parameterMap,
        'cache' : true,
        'dataType' : 'jsonp',
        'jsonpCallback' : 'cb',
        'success' : function(data, textStats, XMLHttpRequest) {
          console.log(data);
        }
      });
  
};
