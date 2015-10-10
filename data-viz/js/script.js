(function(global){
  var getIt = document.getElementById("fetch-button");
  var showIt = document.getElementById("show-response");
  
  getIt.addEventListener("click", function(){
    console.log("fetching..." + params(feedbackParams));
    fetch(mozUrl + params(feedbackParams)).then(function(res){
      res.json().then(function(json){
        console.log(json);
//        console.log(json.count);
        showResults(json);
      })
    })
  })
  
  
  
  var mozUrl = "https://input.mozilla.org/api/v1/feedback/?";
  
  var feedbackParams = {
//    q: "",
//    happy: 1,
//    platforms: linux,
    locales: "en-US",
//    products: "",
//    versions: "",
    date_delta: "1d",
  }
  
  function params(params){
    var queryString = "";
    for ( var key in params ){
      queryString += key + '=' + params[key] + '&';
    }
    return queryString.slice(0, -1)
  }
  
  function showResults(json){
    showIt.textContent = json.count + ' ' + json.results[50].description;
  }
  
  
  
  
})(this)