var locs = [{
  address: "3240 Prairie Avenue, Boulder, CO 80301",
  title: 'The Spot Bouldering Gym',
  latlng: {lat: 40.0215272, lng: -105.2505871}
},
{
  address: "825 Walnut Street, Boulder CO, 80302",
  title: 'Sherpa\'s Restaurant',
  latlng: {lat: 40.0161644, lng: -105.2844167}
},
{
  address: "1117 Pearl Street, Boulder, CO 80302",
  title: 'Hapa Sushi',
  latlng: {lat: 40.018009, lng: -105.2505871}
},
{
  address: "40.014290, -105.282472",
  title: 'Boulder Creek',
  latlng: {lat: 40.0145327, lng: -105.2821675}
},
{
  address: "1111 Engineering Dr, Boulder, CO 80309",
  title: 'The CU Engineering Center',
  latlng: {lat: 40.0071656, lng: -105.2627072}
}];

function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
};

var Location = function(data) {
  this.address = data.address;
  this.title = data.title;
  // markers are assigned later
  this.latlng = data.latlng;
  this.marker = null;
  this.selected = ko.observable(false);
  this.filtered = ko.observable(false);
}

var MapViewModel = function() {
  var self = this;
  self.map = null;
  self.center = {lat: 40.02, lng: -105.27};
  self.city = 'Boulder';
  self.locations = ko.observableArray([]);
  
  locs.forEach((loc) => {
    self.locations().push( new Location(loc));
  })
  
  self.addLocationMarkers = () => {
    // first get the geolocation from the address to place markers:
    self.locations().forEach((loc) => {
      loc.map = self.map;

      loc.marker = new google.maps.Marker({
        position: loc.latlng,
        animation: google.maps.Animation.DROP,
        title: loc.title
      });
      loc.marker.setMap(loc.map);

      loc.marker.addListener('click', function() {
        self.selectPlace(loc);
      });
      
      //Then get Yelp data - this calls a build infowindow function as a success callback
      self.fetchYelp(loc);
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
    
    loc.infowindow = new google.maps.InfoWindow({
      content: infoHtml
    });
    
    loc.infowindow.addListener('closeclick', function() {
      self.selectPlace(loc)
    });

  };
  
  self.selectPlace = (loc) => {
//    first, deselect other places
    for (var i in self.locations()){
      if (self.locations()[i] != loc &&
          self.locations()[i].selected) {
        self.locations()[i].selected(false);
        self.locations()[i].infowindow.close();
        self.locations()[i].marker.setAnimation(null);
      }
    }
    if (loc.selected()) {
      loc.selected(false);
      loc.infowindow.close()
    } else {
      loc.selected(true);
      loc.infowindow.open(loc.map, loc.marker)
    }
    toggleBounce(loc.marker);
  };
  
  self.query = ko.observable('');
  
  self.filter = (value) => {
    // modified from this helpful post: http://opensoul.org/2011/06/23/live-search-with-knockoutjs/
    
    // if they match search terms, add them back in
    
    for (var i in locs) {
      if (locs[i].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        self.locations()[i].filtered(false);
        self.locations()[i].marker.setMap(self.map);
      } else {
        self.locations()[i].filtered(true);
        self.locations()[i].marker.setMap(null);
      }
    }
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

