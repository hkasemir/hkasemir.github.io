(function(global){
   
  
  var pixabayBaseUrl = 'http://pixabay.com/api/?';
  var pixParams = {
    username: 'hkasemir',
    key: '359bac60518da09986f4',
//    response_group: 'high_resolution',
    q: 'adventure',
    image_type: 'photo',
    orientation: 'horizontal',
    per_page: 200
  }
  var search = $('#search');
  var slideShow = $('#slideshow');
  
  
  function startShow(images){
    var oldImages = [];
    var pixIndex = 0;
    
    function setImage(){
      slideShow.fadeOut('slow', function(){
        slideShow.css(
          {'background': 'url(' + images[pixIndex].webformatURL + ') no-repeat center center',
        'background-size': 'cover'});
        setTimeout(function(){
          slideShow.fadeIn()
        }, 500);
      });
    };
    
    setImage();
    setInterval(function(){
      pixIndex++;
      setImage();
      if(!images[pixIndex + 1]){
        pixIndex = 0;
      }
    }, 10000);
  }
  
  
  search.on('keydown', function(e){
    if (e.keyCode == 13 && e.target.value){
      
      console.log('submitted: ' + e.target.value);
      pixParams.q = e.target.value;
      fetch(pixabayBaseUrl + $.param(pixParams))
        .then(function(res){
        res.json()
          .then(function(json){
          console.log(json);
          startShow(json.hits);
      })});
    }
  })
  
  
})(this);