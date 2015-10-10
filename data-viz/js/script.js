(function(global){
  var getIt = document.getElementById("fetch-button");
  var showIt = document.getElementById("show-response");
  
  getIt.addEventListener("click", function(){
    console.log("fetching..." + params(feedbackParams));
    fetch(mozUrl + params(feedbackParams)).then(function(res){
      res.json().then(function(json){
        console.log(json);
        var data = getHappy(json.results);
        console.log(data);
        createD3Svg(data);
//        showIt.textContent = localeObj.nowhere.happy + localeObj.nowhere.sad + 
//          " responses came from nowhere, and " + 
//          localeObj.nowhere.happy / ( localeObj.nowhere.sad + localeObj.nowhere.happy) * 100 +
//          "% were happy.";
      })
    })
  })
  
  
  
  var mozUrl = "https://input.mozilla.org/api/v1/feedback/?";
  
  var feedbackParams = {
//    q: "",
//    happy: 1,
//    platforms: linux,
//    locales: "en-US",
//    products: "",
//    versions: "",
    max: 10000,
    date_delta: "1d",
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
      if (locales.indexOf(place) <= 0) {
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
  
  
  
  
})(this)