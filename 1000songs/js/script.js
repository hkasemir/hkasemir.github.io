(function(global){
  
  var pixabayBaseUrl = 'http://pixabay.com/api/?';
  var pixParams = {
    username: 'hkasemir',
    key: '359bac60518da09986f4',
    response_group: 'high_resolution',
    q: 'landscape',
    image_type: 'photo',
    orientation: 'horizontal',
    per_page: 200
  }
  
  var ImageModel = Backbone.Model.extend({
    defaults: {
      image_arr: '',
      image_q: ''
    },
    
    initialize: function(){
      this.on('change:image_q', this.getImages)
    },
    
    getImages: function(){
//      console.log('getting images for: ' + this.get('image_q'));
      pixParams.q = this.get('image_q');
      fetch(pixabayBaseUrl + $.param(pixParams))
        .then((res) => {
        res.json()
          .then((json) => {
//          console.log('image Array:');
//          console.log(json);
          this.set({
            image_arr: json.hits
          });
        });
      });
    }
    
  });
  
  var ImageView = Backbone.View.extend({
    
    el: 'section#slideshow',
    
    initialize: function(){
      this.slideshow = $('#slideshow');
      this.listenTo(this.model, 'change:image_arr', this.startShow);
      $('.back').fadeOut(0);
    },
    
    startShow: function(){
      if(this.currentShow){
        this.stopShow(this.currentShow);
      }
//      console.log('show started');
      var images = this.model.get('image_arr');
      var pixIndex = 0;
      $('.back').css(
//          {'background': 'url(' + images[pixIndex].webformatURL + ') no-repeat center center',
          {'background': 'url(' + images[pixIndex].imageURL + ') no-repeat center center',
        'background-size': 'cover'});
      pixIndex++;
      this.switchImages(images, pixIndex);
      this.currentShow = setInterval(() => {
        pixIndex++;
        this.switchImages(images, pixIndex);
        if(!images[pixIndex + 1]){
          pixIndex = 0;
        }
      }, 15000);
    },
    
    stopShow: function(interval){
      clearInterval(interval)
    },
    
    switchImages: function(images, pixIndex){
      var from = $('.front'),
          to   = $('.back');
      from.addClass('back').removeClass('front');
      to.addClass('front').removeClass('back');
      from.fadeOut('slow', function(){
//      console.log(to);
//      console.log(from);
//      console.log('from gets pixindex of: ' + pixIndex);
        from.css(
//          {'background': 'url(' + images[pixIndex].webformatURL + ') no-repeat center center',
          {'background': 'url(' + images[pixIndex].imageURL + ') no-repeat center center',
        'background-size': 'cover'});
          
        setTimeout(function(){
          to.fadeIn('slow');
        }, 500);
      });
    }
    
    
  });
  
  var SearchView = Backbone.View.extend({
    
    el: 'html',

    initialize: function(){
      this.search = $('#search');
    },
    
    events: {
      'keydown #search': 'submitQ'
    },
    
    submitQ: function(e){
      if (e.keyCode == 13){
        
//        console.log('submitted: ' + e.target.value);
        this.model.set({image_q: e.target.value});
      }

    }
  });
      
  var model1 = new ImageModel();
  var search = new SearchView({model: model1});
  var show = new ImageView({model: model1});
  
  
})(this);