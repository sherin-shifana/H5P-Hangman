H5P.Hangman = (function ($, UI, EventDispatcher) {

  function Hangman(options, id) {
    // EventDispatcher.call(this);
    const that = this;
    that.options = options;
    // Keep provided id.
    that.id = id;
    that.createStartScreenDomElements();
    // that.
  }

  // register DOM elements
  Hangman.prototype.createStartScreenDomElements = function () {
    const that = this;

    that.$categorySelect = $('<select class="category" placeholder="Chose Category"></select>');
    that.categories = that.options.categorySelectionList.map(function (catObj) {
      return catObj.categoryText;
    });

    that.$levelSelect = $('<select class="levels">'+
                          '<option value="10" selected class="options-select">Level 10</option>' +
                          '<option value="9" class="options-select">Level 9</option>' +
                          '<option value="8" class="options-select">Level 8</option>' +
                          '<option value="7" class="options-select">Level 7</option>' +
                          '<option value="6" class="options-select">Level 6</option>' +
                          '</select>');

    // TODO: translation for start game button
    const cFunction = that.startGame.bind(this);
    that.$startGameButton = UI.createButton({
      'title': 'Start the Game',
      'text': 'Start Game',
      'class': 'start-button',
      click : cFunction
    });

  };

  Hangman.prototype.createGameScreenDomElements = function () {
    this.$status = $('<div class="h5p-status">' +
      '<div class="h5p-time-spent"><time role="timer" datetime="PT00H00M0S">00:00:00</time></div>' +
      '<div class = "h5p-attempts-left"> Attempts left : <span>10</span></div>' +
      '</div>');

    this.timer = new Hangman.Timer(this.$status.find('time')[0]);
    this.counter = new Hangman.Counter(this.$status.find('span'));
    this.hangman = new Hangman.HangmanVector(this.levelChosen);

    this.$taskDescription = $('<div class="task-description"></div>');
    this.$alphabetContainer = $('<div class="alphabet-container"></div>');
    this.$guessContainer = $('<div class="guess-container"></div>');

    this.$hangmanContainer = $('<div class="hangman-container"></div>');


  };

  Hangman.prototype.startGame = function () {
    const that = this;
    that.getWord();
    console.log(this);
    this.createGameScreenDomElements();
    this.$container.empty().removeClass('first-screen');
    this.$status.appendTo(this.$container);

    const $taskDescription = $('<p> Use the alphabets below to guess the word, or click the hint to get a clue </p>');
    const alphabets = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z';
    alphabets.split(',').forEach(function (c) {
      $('<div class="h5p-letter">'+c+'</div>').appendTo(that.$alphabetContainer);
    });

    const guesses = that.chosenWord.word;
    for (let i = 0; i < guesses.length; i++) {
      // const guess = guesses[i];
      that.$guessContainer.append('<div class="guess">'+'_'+'</div>');
    }


    $taskDescription.appendTo(this.$container);
    this.$alphabetContainer.appendTo(this.$container);
    this.hangman.appendTo(this.$hangmanContainer);
    this.$hangmanContainer.appendTo(this.$container);
    $('<p>The chosen category is '+that.categoryChosen+'</p>').appendTo(this.$container);
    this.$guessContainer.appendTo(this.$container);

    that.$alphabetContainer.find('.h5p-letter').click(function () {
      // console.log($(this).text());
      const foundAt = that.checkGuess($(this).text());
      if (foundAt.length === 0) {
        that.counter.decrement();
        that.hangman.drawNext();
      }
      else {
        that.addGuessedLetter(foundAt, $(this).text());
      }

    });
  };

  Hangman.prototype.checkGuess = function (letter) {
    const that = this;
    // console.log(that.guesses);
    const foundAt = [];
    const currentWord = that.chosenWord.word.toUpperCase();
    for ( let i = 0; i< currentWord.length; i++) {
      if (currentWord[i]===letter) {
        foundAt.push(i);
      }
    }

    return foundAt;
  };

  Hangman.prototype.createButton = function () {

  };

  // get randomized word
  Hangman.prototype.getWord = function () {
    const that = this;

    const wordListObj=this.options.categorySelectionList.filter(function (category) {
      return category.categoryText === that.categoryChosen;
    });

    this.wordList = wordListObj[0].categoryWordList.map(function (obj) {
      return ({ "word": obj.word, "hint": obj.hintText});
    });

    const randomIndex = Math.floor(Math.random() * this.wordList.length);
    this.chosenWord = this.wordList[randomIndex];

  };

  Hangman.prototype.addGuessedLetter = function (position, letter) {
    const that = this;
    position.forEach(function (index) {
      that.$guessContainer.find('.guess')[index].innerHTML= letter+"<span>&#818;</span>";
    });
  };

  // attach game
  Hangman.prototype.attach = function ($container) {

    const that=this;
    $container.addClass('h5p-hangman').addClass('first-screen');

    that.categories.forEach(function (category) {
      $('<option value="'+category+'">'+category+'</option>').appendTo(that.$categorySelect);
    });

    const $contentWrapper = $('<div/>',{
      'class': 'content-wrapper'
    });
    const $buttonContainer = $('<div />', {
      'class': 'button-container'
    });
    that.$categorySelect.appendTo($contentWrapper);
    that.$levelSelect.appendTo($contentWrapper);
    that.$startGameButton.appendTo($buttonContainer);

    that.categoryChosen = that.$categorySelect.val();
    that.$categorySelect.on('change', function () {
      that.categoryChosen = this.value;
    });

    that.levelChosen = that.$levelSelect.val();
    that.$levelSelect.on('change', function () {
      that.levelChosen = this.value;
    });

    $buttonContainer.appendTo($contentWrapper);
    $contentWrapper.appendTo($container);
    that.$container = $container;
  };
  return Hangman;
})(H5P.jQuery, H5P.JoubelUI, H5P.EventDispatcher);
