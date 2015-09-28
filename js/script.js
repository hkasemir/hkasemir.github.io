(function(global){
  
  
  var thumbnailLinks = document.querySelectorAll("a.thumb");
  for ( var i = 0; i < thumbnailLinks.length; i++){
    var imgSrc = thumbnailLinks[i].getAttribute("data-img-src")
    thumbnailLinks[i].style.background = "url(" + imgSrc + ") center center"; 
    thumbnailLinks[i].style.backgroundSize = "cover"; 
  }
  
  
})(this)