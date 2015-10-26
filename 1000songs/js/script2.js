(function(global){
  
  var ImageModel = Backbone.Model.extend({
    defaults: {
      image_arr: '',
      image_q: 'landscape'
    },
    
    initialize: function(){
      
    }
    
  });
  
  var SearchView = Backbone.View.extend({
    
    el: 'html',
    
    initialize: function(){
      this.search = $('#search');
    },
    
    events: {
      'keydown body': 'submitQ'
    },
    
    submitQ: function(e){
      console.log('submitted: ' + e.target.value);

    }
  });
      
  var model1 = new ImageModel();
  var search = new SearchView({model: model1});
  
  
})(this);