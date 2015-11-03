(function (global) {
  
  // using Wordink API endpoint with following parameters:
  
  var randomWordBaseURL = "http://api.wordnik.com:80/v4/words.json/randomWord?";
  var randomWordParams = {
    hasDictionaryDef: "true",
    excludePartOfSpeech: "proper-noun",
    minCorpusCount: "20000",
    minLength: 8,
    maxLength: 10,
    api_key: "a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"
  };
  
  
//  Backbone model. Includes attributes for letters guessed, wrong guesses, and the word.
//  also includes a method to fetch a new word.
  
  var RandomWord = Backbone.Model.extend({
    
    defaults: {
      word: 'example',
      lettersGuessed: [],
      wrongGuesses: []
    },
    
    initialize: function() {
      this.fetchNewWord();
    },
    
    fetchNewWord: function(){
    
//     uses fat arrow to preserve `this` context!
      $.ajax(randomWordBaseURL+$.param(randomWordParams)).done((res) => {
//         remove capitalized words and those with punctuation.
        if (res.word.search(/[^a-z]/) >= 0){
            this.fetchNewWord();
        } else {

          this.set({ 
            word: res.word,
            lettersGuessed: [],
            wrongGuesses: []
          });
        };
      });
    }
  });
  
  
//  MainView will handle the keypresses and most of the game logic.
//  It will also render a loss or win.
  
  var MainView = Backbone.View.extend({
    
    el: 'html',
            
    events: {
      'keydown body': 'checkKey'
    },
    
    initialize: function() {
      this.listenTo(this.model, 'change', this.resetWord);
      this.resultsDiv = $('#results');
      this.wordDiv = $('#word');
    },
    
    resetWord: function(){
//      cleans the view and game logic from previous round
      this.word = this.model.get('word');
      this.guessed = this.model.get('lettersGuessed');
      this.wrong = this.model.get('wrongGuesses');
      this.wordDiv.removeClass('red victory');
      this.resultsDiv.text('');
    },
    
    checkKey: function(evt){
//       fetch a new word by pressing 'enter'
      if (evt.keyCode == 13){
          this.model.fetchNewWord();
      }
//       Check if round is won or lost. If so, return without doing anything.
      if (this.wrong.length == svgParts.length){
        return
      }
      
      if (this.wordDiv.text().search('_') < 0){
        return
      }
      
//       check if keypress is a letter:
      var guess = String.fromCharCode(evt.keyCode).toLowerCase();
      
      if (/[a-z]/.test(guess) 
        && this.guessed.indexOf(guess) < 0
        && guess.length == 1){
          this.guessed.push(guess);
        
//         if the letter is not in the word,
//         push it to the wrong guesses array:
        if(this.word.search(guess) < 0 ) {
          this.wrong.push(guess);
        };
        
//         set variables in the model
        this.model.set({
          lettersGuessed: this.guessed,
          wrongGuesses: this.wrong
        });
//        for some reason resetting variables is not triggering a 
//        change event on the model, so manually trigger:
        this.model.trigger('change:lettersGuessed');

      }
      
//      render win or loss
      if (this.wrong.length == svgParts.length) {
        this.renderLoss();
        return
      }

      if (this.wordDiv.text().search('_') < 0) {
        this.renderWin();
        return
      }
    },
    
    renderWin: function(){
      this.wordDiv.addClass('victory')
      this.resultsDiv.text('You win!!');
    },
    
    renderLoss: function(){
      this.wordDiv.addClass('red');
      this.resultsDiv.text('Wrong, the word was "' +
                               this.word + '"');
    }
    
  })
  
  
//  SVGView renders the hangman SVG based on the length of the 
//  wrongGuesses array in the model.
  
  var SVGView = Backbone.View.extend({
    
    initialize: function() {
      _.bindAll(this, 'render');

//      When a guess is made, re-render the SVG per the wrong guesses array.
//      Could be more efficient to only re-render when wrongGuesses is changed
      this.listenTo(this.model, 'change:lettersGuessed', this.render);
      this.svg = document.getElementById('hangman');
    },
    
    render: function(){
//      Need to remove the svg parts first, otherwise appending makes a
//      big, messy svg.
      while (this.svg.lastChild) {
        this.svg.removeChild(this.svg.lastChild);
      };
      
      for (var i=0; i < this.model.get('wrongGuesses').length; i++){
        var newSvg = makeSVG(svgParts[i].type, svgParts[i].attrs);
        this.svg.appendChild(newSvg);
      };
    },
  })
  
  
//  WordView renders the word and the wrong guesses, checking to see if
//  letters in the word have been guessed to reveal them.
  
  var WordView = Backbone.View.extend({
    
    
    initialize: function() {
      _.bindAll(this, 'render');
      
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'change:lettersGuessed', this.render);
      this.wordDiv = $('#word');
      this.guessedDiv = $('#guessed-letters');
      this.render();
    },
    
    render: function(){
      
      this.word = this.model.get('word');
      this.guessed = this.model.get('lettersGuessed')
      this.wrong = this.model.get('wrongGuesses')
      var displayText = '';
      
      this.guessedDiv.text(this.wrong.join(' '));
      
      for (var i=0; i<this.word.length; i++){
        if (this.guessed.indexOf(this.word[i]) >= 0){
          displayText += this.word[i];
        } else {
          displayText += '_';
        }
      };
      
      this.wordDiv.text(displayText);
    },
  });
  
  
//  svgParts holds all the information for drawing the hangman SVG
  
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
   {
      type: 'circle',
      attrs: {
        fill: 'none',
        stroke: 'black',
        'stroke-width': '5',
        cx: 140,
        cy: 50,
        r: 10
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
        y1: 60,
        y2: 100
      }
    },
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

  function makeSVG(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
      el.setAttribute(k, attrs[k]);
    return el;
  };
  
  var wordModel = new RandomWord();
  var mainView = new MainView({model: wordModel});
  var svgView = new SVGView({model: wordModel});
  var wordView = new WordView({model: wordModel});

})(this)