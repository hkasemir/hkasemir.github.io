(function(global){
  
  var pixabayBaseUrl = 'http://pixabay.com/api/?';
  var pixParams = {
    username: 'hkasemir',
    key: '359bac60518da09986f4',
    response_group: 'high_resolution',
    q: 'landscape',
    image_type: 'photo',
    orientation: 'horizontal',
    per_page: 5
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
      this.slide = $('#slide');
      this.buffer = $('#buffer-img');
      this.listenTo(this.model, 'change:image_arr', this.startShow);
    },
    
    events: {
      'click div.next': 'switchImages',
      'click div.last': 'goBack',
      'click div.pause': 'stopShow',
      'click div.resume': 'resumeShow'
    },
    
    startShow: function(){
      if(this.currentShow){
        this.stopShow();
      };
      
      var imgLoadHandler = () => {
        this.switchImages();
        this.buffer.off('load', imgLoadHandler);
      }
      
      this.images = this.model.get('image_arr');
      this.pixIndex = 0;
      this.buffer.on('error', () =>  {
        console.log('image loading error');
        this.pixIndex++;
        this.buffer.attr('src', this.images[this.pixIndex].imageURL);
      })
      
      this.buffer.on('load', imgLoadHandler)
        
      this.buffer.attr('src', this.images[this.pixIndex].imageURL);
      this.currentShow = setInterval(() => {
        this.switchImages();
      }, 10000);
    },
    
    stopShow: function(){
      console.log('stopping show');
      var pauseButton = $('.pause');
      pauseButton.removeClass('pause').addClass('resume').text('resume');
      clearInterval(this.currentShow);
    },
    
    switchImages: function(){
      this.slide.css(
          {'background': 'url(' + this.buffer.attr('src') + ') no-repeat center center',
        'background-size': 'cover'});
      this.pixIndex++;
      this.buffer.attr('src', this.images[this.pixIndex].imageURL);
      console.log('buffering: ' + this.images[this.pixIndex].imageWidth)
      if(!this.images[this.pixIndex + 1]){
        this.pixIndex = -1;
      }
    },
    
    goBack: function(){
      this.pixIndex == 0 ?
        this.pixIndex = this.images.length - 2 :
        this.pixIndex -= 2;
      this.switchImages();
    }, 
    
    resumeShow: function(){
      var resumeButton = $('.resume');
      resumeButton.removeClass('resume').addClass('pause').text('pause');
      
      this.switchImages();
      
      this.currentShow = setInterval(() => {
        this.switchImages();
      }, 10000);
    }
    
    
  });
  
  var ControlView = Backbone.View.extend({
    
    el: 'section#control-bar',

    initialize: function(){
      this.search = $('#search');
    },
    
    events: {
      'keydown #search': 'submitQ',
    },
    
    submitQ: function(e){
      if (e.keyCode == 13){
        
//        console.log('submitted: ' + e.target.value);
        this.model.set({image_q: e.target.value});
      }

    }
  });
      
  var model1 = new ImageModel();
  var search = new ControlView({model: model1});
  var show = new ImageView({model: model1});
  
  
})(this);