(function(global){

  var randomWordBaseURL = "http://api.wordnik.com:80/v4/words.json/randomWord?";
  var randomWordParams = {
    hasDictionaryDef: "true",
    excludePartOfSpeech: "proper-noun",
    minCorpusCount: "20000",
    minLength: 8,
    maxLength: 10,
    api_key: "a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"
  };
  
  function makeSVG(tag, attrs) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
      el.setAttribute(k, attrs[k]);
    return el;
  };

  
  var RandomWord = Backbone.Model.extend({
    defaults: {
      word: 'example',
      lettersGuessed: []
    }
      
  });
  
  var WordView = Backbone.View.extend({
    
    el: 'html',
        
    events: {
      'click button#refresh': 'fetchNewWord',
      'keydown body': 'checkKey'
    },
    
    initialize: function(){
      _.bindAll(this, 'render', 'fetchNewWord', 'drawSvg');
      
      this.listenTo(this.model, 'change', this.render);
      this.wordDiv = $('#word');
      this.guessedDiv = $('#guessed-letters');
      this.svg = document.getElementById('hangman');
      this.fetchNewWord();
    },
    
    render: function(){
      
      this.word = this.model.get('word');
      this.guessed = this.model.get('lettersGuessed')
      var displayText = [];
      var incorrect = [];
      var done = true;
      for (var i=0; i<this.word.length; i++){
        if (this.guessed.indexOf(this.word[i]) >= 0){
          displayText.push(this.word[i]);
        } else {
          displayText.push('_');
          done = false;
        }
      };
      
      for (var i=0; i<this.guessed.length; i++){
        if (this.word.indexOf(this.guessed[i]) < 0){
          incorrect.push(this.guessed[i]);
        }
      };
      this.wordDiv.text(displayText.join(' '));
      if (done){
        this.guessedDiv.text("WINNER!!");
        return;
      }
      this.drawSvg(incorrect);
      this.guessedDiv.text(incorrect.join(' '));
      if (incorrect.length == svgParts.length){
        console.log('LOSE!!!!');
        this.guessedDiv.append(' - you lose, the word was ' + this.word);
      }
    },
    
    drawSvg: function(wrongGuesses){
      while (this.svg.lastChild) {
        this.svg.removeChild(this.svg.lastChild);
      };
      for (var i=0; i < wrongGuesses.length; i++){
        var newSvg = makeSVG(svgParts[i].type, svgParts[i].attrs);
        this.svg.appendChild(newSvg);
      };
    },
    
    fetchNewWord: function(){
      $.ajax(randomWordBaseURL+$.param(randomWordParams)).done((res) => {
         
        console.log(res.word.toLowerCase());
        this.model.set({ word: res.word.toLowerCase(),
                 lettersGuessed: [] });
        
      });
    },
    
    checkKey: function(evt){

      var guess = String.fromCharCode(evt.keyCode).toLowerCase();
      console.log(guess);
      if (/[a-z]/.test(guess) 
        && this.guessed.indexOf(guess) < 0
        && guess.length == 1){
          this.guessed.push(guess);
          this.render();
      }
    }
      
  });
  


  var wordModel = new RandomWord()
  var wordView = new WordView({model: wordModel});
  
  var svgParts = [
    {
    type: 'polyline',
      attrs: {
        points: '190,180 10,180 40,180 40,10 40,30 60,10 37.5,10 142.5,10',
        fill: 'none',
        stroke: 'black',
        'stroke-width': '5'
      }
    },
    {
      type: 'line',
      attrs: {
        fill: 'none',
        stroke: 'black',
        'stroke-width': '5',
        x1: 140,
        x2: 140,
        y1: 10,
        y2: 40
      }
    },
 //  '<circle cx="140" cy="50" r="10" 
   {
      type: 'circle',
      attrs: {
        fill: 'none',
        stroke: 'black',
        'stroke-width': '5',
        cx: 140,
        cy: 50,
        r: 10,
      }
    },
//  '<line x1="140" x2="140" y1="60" y2="100" stroke="black" fill="transparent" stroke-width="5"/>',
    {
      type: 'line',
      attrs: {
        fill: 'none',
        stroke: 'black',
        'stroke-width': '5',
        x1: 140,
        x2: 140,
        y1: 60,
        y2: 100
      }
    },
//  '<line x1="140" x2="130" y1="97.5" y2="130" stroke="black" fill="transparent" stroke-width="5"/>',
    {
      type: 'line',
      attrs: {
        fill: 'none',
        stroke: 'black',
        'stroke-width': '5',
        x1: 140,
        x2: 130,
        y1: 97.5,
        y2: 130
      }
    },
//  '<line x1="140" x2="150" y1="97.5" y2="130" stroke="black" fill="transparent" stroke-width="5"/>',
    {
      type: 'line',
      attrs: {
        fill: 'none',
        stroke: 'black',
        'stroke-width': '5',
        x1: 140,
        x2: 150,
        y1: 97.5,
        y2: 130
      }
    },
//  '<line x1="140" x2="130" y1="70" y2="95" stroke="black" fill="transparent" stroke-width="5"/>',
    {
      type: 'line',
      attrs: {
        fill: 'none',
        stroke: 'black',
        'stroke-width': '5',
        x1: 140,
        x2: 130,
        y1: 70,
        y2: 95
      }
    },
//  '<line x1="140" x2="150" y1="70" y2="95" stroke="black" fill="transparent" stroke-width="5"/>'
    {
      type: 'line',
      attrs: {
        fill: 'none',
        stroke: 'black',
        'stroke-width': '5',
        x1: 140,
        x2: 150,
        y1: 70,
        y2: 95
      }
    }
        
  ];

//    ]
  
})(this)