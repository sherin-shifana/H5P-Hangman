H5P.Hangman = (function ($, UI, EventDispatcher) {

  /**
  * Hangman Constructor
  *
  * @class H5P.Hangman
  * @extends H5P.EventDispatcher
  * @param {Object} options
  * @param {Number} id
  */
  function Hangman(options, id) {

    // Initialize event inheritance
    EventDispatcher.call(this);
    const that = this;
    that.options = options;
    // Keep provided id.
    that.id = id;
    that.isInline = true;
    that.isGameStarted = false;
    that.isGameFinished = false;
    that.createStartScreenDomElements();
  }

  /**
  *
  * Register game screen DOM elements
  * @param {H5P.jQuery} $container
  */
  Hangman.prototype.createStartScreenDomElements = function () {
    const that = this;
    that.$categorySelect = $('<select class="category" placeholder="Chose Category"></select>');
    that.categories = that.options.categorySelectionList.map(function (catObj) {
      return catObj.categoryText;
    });

    that.categories.forEach(function (category) {
      $('<option value="' + category + '">' + category + '</option>').appendTo(that.$categorySelect);
    });

    that.$levelSelect = $('<select class="levels">' +
      '<option value="10" selected class="options-select">Level 10</option>' +
      '<option value="9" class="options-select">Level 9</option>' +
      '<option value="8" class="options-select">Level 8</option>' +
      '<option value="7" class="options-select">Level 7</option>' +
      '<option value="6" class="options-select">Level 6</option>' +
      '</select>');
  };

  /**
  *
  * Register game screen DOM elements
  * @param {H5P.jQuery} $container
  */
  Hangman.prototype.createGameScreenDomElements = function () {
    const that = this;
    this.$status = $('<div class="h5p-status">' +
      '<div class="h5p-time-spent"><time role="timer" datetime="PT00H00M0S">00:00:00</time></div>' +
      '<div class = "h5p-attempts-left"> ' + this.options.l10n.attemptsLeft + ' : <span>' + this.levelChosen + '</span></div>' +
      '</div>');

    this.timer = new Hangman.Timer(this.$status.find('time')[0]);
    this.counter = new Hangman.Counter(this.$status.find('span'));
    this.hangman = new Hangman.HangmanVector(this.levelChosen);
    this.popup = new Hangman.Popup(this.$container);

    this.$taskDescription = $('<div class="task-description">' + this.options.l10n.taskDescription + '</div>');
    this.$alphabetContainer = $('<div class="alphabet-container"></div>');
    this.$guessContainer = $('<div class="guess-container"></div>');

    this.$hangmanContainer = $('<div class="hangman-container"></div>');
    this.$buttonContainer = $('<div class="button-container"></div>');

    this.$leftContainer = $('<div class="left-container"></div>');
    this.$rightContainer = $('<div class="right-container"></div>');

    this.$topContainer = $('<div class="top-container"></div>');
    this.$gameContainer = $('<div class="game-container"></div>');

    this.$mainContainer = $('<div class="main-container"></div>');

    // Play again button
    const callBackFunction = that.resetTask.bind(this);
    this.$playAgainButton = UI.createButton({
      'title': 'Play Again',
      'class': 'retry-button button',
      'html': '<span></span>&nbsp;' + this.options.l10n.playAgain,
      click: callBackFunction
    }).appendTo(this.$buttonContainer);

    // Hint button
    this.$hintButton = UI.createButton({
      'title': 'Hint',
      'html': '<span></span>&nbsp;' + this.options.l10n.hint,
      'class': 'hint-button button',
      click: function () {
        that.popup.show(that.chosenWord.hint);
      }
    }).appendTo(this.$buttonContainer);
  };

  /**
  *
  * Game starts
  */
  Hangman.prototype.startGame = function () {
    const that = this;

    // Initialize status of game started to true
    that.isGameStarted = true;
    that.getWord();
    this.$container.empty().removeClass('first-screen');
    this.createGameScreenDomElements();
    this.$container.addClass('second-screen');
    this.$status.appendTo(this.$topContainer);

    // assign levelchosen to attempts left
    that.attemptsLeft = that.levelChosen;
    const alphabets = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z';

    // Get each alphabet
    alphabets.split(',').forEach(function (c) {
      $('<div class="h5p-letter">' + c + '</div>').appendTo(that.$alphabetContainer);
    });

    // assign chosen word to guesses
    const guesses = that.chosenWord.word;

    for (let i = 0; i < guesses.length; i++) {
      that.$guessContainer.append('<div class="guess">' + '_' + '</div>');
    }

    // Initialize count to 0
    this.score = 0;

    this.$taskDescription.appendTo(this.$topContainer);
    this.$alphabetContainer.appendTo(this.$leftContainer);

    $('<p>The chosen category is <span>' + that.categoryChosen + '</span></p>').appendTo(this.$leftContainer);
    this.$guessContainer.appendTo(this.$leftContainer);

    this.hangman.appendTo(this.$hangmanContainer, true);

    this.$hangmanContainer.appendTo(this.$rightContainer);
    this.$buttonContainer.appendTo(this.$rightContainer);

    this.$leftContainer.appendTo(this.$gameContainer);
    this.$rightContainer.appendTo(this.$gameContainer);

    this.$topContainer.appendTo(this.$container);
    this.$gameContainer.appendTo(this.$container);

    this.on('changeHangmanContainer', function () {
      this.$hangmanContainer.empty();
      if (this.isInline) {
        this.hangman.appendTo(this.$hangmanContainer, this.canvasSize);
        this.changeToInlineMode();
      }
      else {
        this.hangman.appendTo(this.$hangmanContainer, this.canvasSize);
        this.changeToBlockMode();
      }

      this.hangman.redraw(this.attemptsLeft);
      this.$container.css({
        'height': 'auto'
      });
    });

    // Close the hint popup when clicking
    $('.h5p-hangman-pop').find('.h5p-hangman-close').click(function () {
      that.popup.close();
    });

    // Let the first letter to be focused when clicking tab
    let $current = that.$alphabetContainer.find('.h5p-letter').first();
    $current.attr("tabindex", 0);

    // Clicking an alphabet or guessing a letter
    that.$alphabetContainer.find('.h5p-letter').click(function () {
      that.afterLetterClick($(this));
    })
      .keydown(function (event) {
        switch (event.which) {
          case 13: // Enter
          case 32: // Space
            that.afterLetterClick($(this));
            break;

          case 37: // Left Arrow
          case 38: // Up Arrow
            // Go to previous dot
            $(this).attr('tabindex', '-1');
            $current = $(this).prev();
            $current.attr('tabindex', 0).focus();
            break;

          case 39: // Right Arrow
          case 40: // Down Arrow
            // Go to next dot
            $(this).attr('tabindex', '-1');
            $current = $(this).next();
            $current.attr('tabindex', 0).focus();
            break;
        }
      });

    /**
      * Resize event
      *
      * @event Hangman#resize
      */
    that.trigger('resize');

  };

  Hangman.prototype.changeToInlineMode = function () {
    this.$container.find('.left-container').removeClass('inline');
    this.$container.find('.right-container').removeClass('inline');
  };

  Hangman.prototype.changeToBlockMode = function () {
    this.$container.find('.left-container').addClass('inline');
    this.$container.find('.right-container').addClass('inline');
  };

  /**
  * After clicking an alphabet
  * @param {H5P.jQuery} $letter
  */
  Hangman.prototype.afterLetterClick = function ($letter) {
    var that = this;
    that.timer.play();
    $letter.addClass("h5p-letter-after-click");
    const foundAt = that.checkGuess($letter.text());

    if (foundAt.length === 0) {
      // If the clicking letter is not found in the chosen word
      that.attemptsLeft--;
      that.counter.decrement();
      that.hangman.drawNext();
    }
    else {
      // If the clicking letter is in the chosen word
      that.addGuessedLetter(foundAt, $letter.text());
      that.score = that.score + foundAt.length;
    }

    // Set maximum score to the chosen word length
    that.maxScore = that.getMaxScore(this.chosenWord.word);

    that.triggerXAPIScored(that.score, that.maxScore, 'answered');

    if (that.attemptsLeft === 0) {
      // If there is no attempts left to continue the game
      that.gameWon = false;
      that.isGameFinished = true;
      that.showFinalScreen();
    }
    else if (this.maxScore === this.score) {
      // If the answer is entered correctly
      that.gameWon = true;
      that.isGameFinished = true;
      that.showFinalScreen();
    }
  };

  /**
  * Show the final screen when game is isGameFinished
  */
  Hangman.prototype.showFinalScreen = function () {
    this.$container.empty();
    this.isGameStarted = false;
    this.getAnswerGiven();

    if (this.gameWon) {
      // If the answer is right
      this.triggerXAPICompleted(this.score, this.maxScore, true);
      this.$container.addClass("game-win-page");
    }
    else {
      // If the answer is wrong or if game loses
      this.triggerXAPIScored(this.score, this.maxScore, false);
      this.$container.addClass("game-over-page");
    }
    this.createFinalScreenDomElements();

    this.$totalTimeSpent.appendTo(this.$resultDiv);
    this.$attemptsLeft.appendTo(this.$resultDiv);
    this.$progressBar.appendTo(this.$resultDiv);
    this.$resultDiv.appendTo(this.$container);
    this.$playAgain.appendTo(this.$container);

    this.trigger('resize');
  };

  /**
   * Get Xapi Data.
   */
  H5P.externalDispatcher.on('xAPI', function (event) {
    console.log(event.data.statement.verb);
  });

  /**
  *
  * Create final screen DOM elements
  */
  Hangman.prototype.createFinalScreenDomElements = function () {
    const that = this;
    this.$resultDiv = $('<div class="result-div"></div>');
    this.$totalTimeSpent = $('<p class="total-time-spent">Time spent ' + '<span>' + this.$status.find('time')[0].innerHTML + '</span></p>');
    this.$attemptsLeft = $('<p class="total-attempts-made">Attempts left  ' + '<span>' + this.attemptsLeft + '</span></p>');

    // Create progress bar
    this.$progressBar = UI.createScoreBar(that.maxScore);
    // Set score to the count of correct letter clicked
    this.$progressBar.setScore(that.score);
    const callBackFunction = that.resetTask.bind(this);
    this.$playAgain = UI.createButton({
      'text': 'Play Again',
      'class': 'retry-button button',
      click: callBackFunction
    });
  };

  /**
  * Reset all the variables container after clicking play again button
  */
  Hangman.prototype.resetTask = function () {
    const that = this;
    that.isGameStarted = false;
    that.isGameFinished = false;
    // that.score = 0;
    that.isInline = true;
    that.canvasSize = 0;
    that.$container.empty().removeClass('game-win-page').removeClass('game-over-page');
    that.attach(that.$container);

  };

  /**
  * Check if the guessed letter is correct or not
  * @param letter
  */
  Hangman.prototype.checkGuess = function (letter) {
    const that = this;
    const foundAt = [];
    const currentWord = that.chosenWord.word.toUpperCase();
    for (let i = 0; i < currentWord.length; i++) {
      if (currentWord[i] === letter) {
        foundAt.push(i);
      }
    }

    return foundAt;
  };

  /**
  * Get the answer given
  *
  */
  Hangman.prototype.getAnswerGiven = function () {
    const that = this;
    if (that.gameWon) {
      that.isCorrect = true;
    }
    else {
      that.isCorrect = false;
    }
    return this.isCorrect;
  };

  /**
  * Get the score given
  * @return score
  */
  Hangman.prototype.getScore = function () {
    return this.score;
  };

  /**
  * Get the maximum score
  * @return word.length
  */
  Hangman.prototype.getMaxScore = function (word) {
    return word.length;
  };

  /**
  * Get randomized word
  */
  Hangman.prototype.getWord = function () {
    const that = this;

    const wordListObj = this.options.categorySelectionList.filter(function (category) {
      return category.categoryText === that.categoryChosen;
    });

    // Define a wordlist containing word and it's hint
    this.wordList = wordListObj[0].categoryWordList.map(function (obj) {
      return ({
        "word": obj.word,
        "hint": obj.hintText
      });
    });

    const randomIndex = Math.floor(Math.random() * this.wordList.length);
    this.chosenWord = this.wordList[randomIndex];
    console.log(this.chosenWord);
  };

  /**
  * If the clicked letter is correct, add it to the correct position
  * @param {H5P.jQuery} that.$guessContainer
  */
  Hangman.prototype.addGuessedLetter = function (position, letter) {
    const that = this;
    position.forEach(function (index) {
      that.$guessContainer.find('.guess')[index].innerHTML = letter + "<span>&#818;</span>";
    });
  };

  /**
   * Attach all elements to container
   * @param {H5P.jQuery} $container The object which our task will attach to.
   */
  Hangman.prototype.attach = function ($container) {

    const that = this;
    $container.addClass('h5p-hangman').addClass('first-screen');

    const $contentWrapper = $('<div/>', {
      'class': 'content-wrapper'
    });
    const $buttonContainer = $('<div />', {
      'class': 'button-container'
    });

    const cFunction = that.startGame.bind(this);
    that.$startGameButton = UI.createButton({
      'title': 'Start the Game',
      'html': '<span></span>&nbsp;' + that.options.l10n.startGame,
      'class': 'start-button button',
      click: cFunction
    });

    that.$categorySelect.appendTo($contentWrapper);
    that.$levelSelect.appendTo($contentWrapper);
    that.$startGameButton.appendTo($buttonContainer);

    // Get the category chosen
    that.categoryChosen = that.$categorySelect.val();
    that.$categorySelect.on('change', function () {
      that.categoryChosen = this.value;
    });

    // Get the selected level
    that.levelChosen = that.$levelSelect.val();
    that.$levelSelect.on('change', function () {
      that.levelChosen = this.value;
    });

    $buttonContainer.appendTo($contentWrapper);
    $contentWrapper.appendTo($container);
    that.$container = $container;

    // On rezize event triggers
    that.on('resize', function () {

      if (that.isGameStarted) {
        if (window.innerWidth >= 576) {
          that.isInline = true;
          if (window.innerWidth < 768 && that.canvasSize !== 200) {
            that.canvasSize = 200;
            that.trigger('changeHangmanContainer');
          }
          if (window.innerWidth > 768 && that.canvasSize !== 250) {
            that.canvasSize = 250;
            that.trigger('changeHangmanContainer');
          }
          if (window.innerWidth > 992 && that.canvasSize !== 300) {
            that.canvasSize = 300;
            that.trigger('changeHangmanContainer');
          }
          if (window.innerWidth > 1200 && that.canvasSize !== 350) {
            that.canvasSize = 350;
            that.trigger('changeHangmanContainer');
          }
        }
        else {
          const curMode = that.isInline;
          if (250 < window.innerWidth && window.innerWidth < 400 && that.isInline) {
            that.isInline = false;
          }
          else if (window.innerWidth > 400 && !that.isInline) {
            that.isInline = true;
          }
          if (that.canvasSize !== 150 || curMode !== that.isInline) {
            that.canvasSize = 150;
            that.trigger('changeHangmanContainer');
          }
        }
      }
      else {
        that.$container.css({
          'height': window.innerHeight + 'px'
        });
      }

    });

    /**
    * Resize event
    *
    * @event Hangman#resize
    */
    that.trigger('resize');
  };

  return Hangman;
})(H5P.jQuery, H5P.JoubelUI, H5P.EventDispatcher);
