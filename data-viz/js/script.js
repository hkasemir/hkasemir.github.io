(function(global){
  var getIt = document.getElementById("fetch-button");
  var showIt = document.getElementById("show-response");
  var loading = '<img src="img/loading.gif" style="height:60px; margin-left:auto; margin-right:auto; display:block;">'
  
  getIt.addEventListener("click", function(){
      showIt.innerHTML = loading;
      console.log("fetching..." + params(feedbackParams));
    fetch(mozUrl + params(feedbackParams)).then(function(res){
      res.json().then(function(json){
        console.log(json);
        var data = getVersion(json.results);
        showIt.innerHTML = '';
        console.log(data);
        versHappyBar(data);
      })
    })
  })
  
  
  
  var mozUrl = "https://input.mozilla.org/api/v1/feedback/?";
  
  var feedbackParams = {
//    q: "",
//    happy: 1,
//    platforms: "android,windows 7,windows 10,firefox os,windows xp,windows 8.1,os x",
    platform: "linus",
//    locales: "en-US",
    products: "Firefox",
    versions: "41.0.1,41.0,42.0,40.0.3,44.0a1,40.0,39.0,19.0,29.0,8.0",
    max: 10000,
    date_delta: "10d",
  }
  
  function params(params){
    var queryString = "";
    for ( var key in params ){
      queryString += key + '=' + params[key] + '&';
    }
    return queryString.slice(0, -1)
  }
  
  function getHappy(results){
    var locales = [], data = [];
    results.forEach(function(res){
      var place = res.locale;
      if (!place) {
        place = 'nowhere';
      }
      if (locales.indexOf(place) < 0) {
        locales.push(place);
        data.push({
          loc: place,
          happy: 0,
          sad: 0
        })
      }
      if (res.happy){
        data[locales.indexOf(place)].happy += 1;
      } else {
        data[locales.indexOf(place)].sad += 1;
      }
    })
    return data;
  }
  
  function getVersion(results){
    var locales = [], data = [];
    results.forEach(function(res){
      var vers = res.version;
      if (!vers) {
        vers = 'none';
      }
      if (locales.indexOf(vers) < 0) {
        locales.push(vers);
        data.push({
          version: vers,
          happy: 0,
          sad: 0
        })
      }
      if (res.happy){
        data[locales.indexOf(vers)].happy += 1;
      } else {
        data[locales.indexOf(vers)].sad += 1;
      }
    })
    return data;
  }
  
  
  
  
})(this)