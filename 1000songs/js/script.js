(function(global){
   
  function params(params){
    var queryString = "";
    for ( var key in params ){
      queryString += key + '=' + params[key] + '&';
    }
    return queryString.slice(0, -1)
  }
  
  var pixabayBaseUrl = 'http://pixabay.com/api/?';
  var pixParams = {
    username: 'hkasemir',
    key: '359bac60518da09986f4',
//    response_group: 'high_resolution',
    q: 'adventure',
    orientation: 'horizontal',
  }
  var search = document.getElementById('search');
  var slideShow = document.getElementById('slideshow');
  
  
  function startShow(images){
    console.log(images[0].webformatURL)
    slideShow.style.background = 'url(' + images[5].webformatURL + ') no-repeat center center';
    slideShow.style.backgroundSize = 'cover';
  }
  
  
  search.addEventListener('keydown', function(e){
    if (e.keyCode == 13 && e.target.value){
      
      console.log('submitted: ' + e.target.value);
      fetch(pixabayBaseUrl + params(pixParams))
        .then(function(res){
        res.json()
          .then(function(json){
          console.log(json);
          startShow(json.hits);
      })});
    }
  })
  
  
})(this);