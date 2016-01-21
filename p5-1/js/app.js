var locs = [{
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

var markers = [];

var Location = function(data) {
  this.address = data.address;
  this.title = data.title;
  // latLng and map are calculated or assigned later
  this.latlng = null;
  this.map = null;
}

var MapViewModel = function() {
  var self = this;
  self.map = null;
  self.center = {lat: 40.02, lng: -105.27};
  self.city = 'Boulder';
  self.locations = ko.observableArray([]);
  self.markers = ko.observableArray([]);
  
  locs.forEach((loc) => {
    self.locations().push( new Location(loc));
  })
  
  self.addLocationMarkers = () => {
    // first get the geolocation from the address to place markers:
    self.locations().forEach((loc) => {
      var latlng;
      var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + loc.address;
      fetch(url).then((response)=>{
        response.json().then((json)=>{
          loc.latlng = json.results[0].geometry.location;
          loc.map = self.map;
          
          //Then get Yelp data - this calls a build infowindow function as a success callback
          self.fetchYelp(loc);
        })});
    });
  };
  
  self.fetchYelp = (loc) => {
    // From this very helpful gist : https://gist.github.com/kennygfunk/c24c8a2ea71c9ce7f4fc
    var auth = {
      consumerKey : "4NSfQz0B0AcatVl7p2CVQA",
      consumerSecret : "oGXlKX8vymwdBBx6khM8kij6G-U",
      accessToken : "QTEdTYBzg1dlfzUstVI6dFk4XJs-5A1M",
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
    parameters.push(['term', loc.title]);
    parameters.push(['location', self.city]);
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

    $.ajax({
      'url' : message.action,
      'data' : parameterMap,
      'cache' : true,
      'dataType' : 'jsonp',
      'success' : function(data) {
        self.buildInfoWindow(data, loc);
    }
    });
  };
  
  self.buildInfoWindow = (data, loc) => {
    var infoHtml = '<div class="info-window"><h2>' +
        loc.title + '</h2><img src="' + data.businesses[0].snippet_image_url +
        '"><p>' + data.businesses[0].snippet_text +
        '<a href="' + data.businesses[0].url + '"> -> Read More</a></p></div>'
    
    var infowindow = new google.maps.InfoWindow({
      content: infoHtml
    });
    var marker = new google.maps.Marker({
      position: loc.latlng,
      animation: google.maps.Animation.DROP,
      title: loc.title
    });
    marker.setMap(loc.map);

    marker.addListener('click', function() {
      infowindow.open(loc.map, marker);
    });
    
    self.markers().push(marker);
  };
  
  self.query = ko.observable('');
  
  self.filter = (value) => {
    // from this helpful post: http://opensoul.org/2011/06/23/live-search-with-knockoutjs/
    
    // first remove markers and items from map
    for (var i in self.markers()){
      console.log(self.markers()[i].title)
      self.markers()[i].setMap(null);
    }
    self.locations.removeAll();
    
    // if they match search terms, add them back in
    
    for (var i in locs) {
      if (locs[i].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        self.locations.push(new Location(locs[i]));
      }
      if (self.markers()[i].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        self.markers()[i].setMap(self.map);
      }
    }
    
    console.log('hi ' + value);
  }
}


var MapView = new MapViewModel();
MapView.query.subscribe(MapView.filter)
ko.applyBindings(MapView);

function initMap() {
  MapView.map = new google.maps.Map(document.getElementById('map'), {
    center: MapView.center,
    zoom: 14
  });
  
  MapView.addLocationMarkers();
};

