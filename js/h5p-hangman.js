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
  * Register start screen DOM elements
  */
  Hangman.prototype.createStartScreenDomElements = function () {
    const that = this;
    that.$categorySelect = $('<select class="category" placeholder="Chose Category"></select>');
    that.categories = that.options.categorySelectionList.map(function (catObj) {
      return catObj.categoryText;
    });

    that.categories.forEach(function (category) {
      $('<option class="option" value="' + category + '">' + category + '</option>').appendTo(that.$categorySelect);
    });

    that.$levelSelect = $('<select class="levels">' +
      '<option value="10" selected class="options-select">10 attempts</option>' +
      '<option value="9" class="options-select">9 attempts</option>' +
      '<option value="8" class="options-select">8 attempts</option>' +
      '<option value="7" class="options-select">7 attempts</option>' +
      '<option value="6" class="options-select">6 attempts</option>' +
      '</select>');
  };

  /**
  * Register game screen DOM elements
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
    this.$selectedCategory = $('<p>The chosen category is <span>' + that.categoryChosen + '</span></p>');
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
      'class': 'retry-button button',
      'html': '<span><i class="fa fa-undo" aria-hidden="true"></i></span>&nbsp;' + this.options.l10n.playAgain,
      click: callBackFunction
    }).appendTo(this.$buttonContainer);

    // Hint button
    if (that.chosenWord.hint) {
      this.$hintButton = UI.createButton({
        'html': '<span><i class="fa fa-info-circle" aria-hidden="true"></i></span>&nbsp;' + this.options.l10n.hint,
        'class': 'hint-button button',
        click: function () {
          that.popup.show(that.chosenWord.hint);
        }
      }).appendTo(this.$buttonContainer);
    }

  };

  /**
  * Game starts when the start game button clicked
  */
  Hangman.prototype.startGame = function () {
    const that = this;
    that.isGameStarted = true;
    this.alphabets = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z';
    this.keys = this.options.keys;
    this.score = 0;
    this.clickedLetters = [];

    that.getWord();
    this.$container.empty().removeClass('first-screen');
    this.createGameScreenDomElements();
    this.$container.addClass('second-screen');
    this.$status.appendTo(this.$topContainer);

    // assign levelchosen to attempts left
    that.attemptsLeft = that.levelChosen;

    // Get each alphabet
    if (this.keys.length>=27 ) {
      this.keys.split(',').forEach(function (c) {
        $('<div class="h5p-letter">' + c + '</div>').appendTo(that.$alphabetContainer);
      });
    }
    else {
      this.alphabets.split(',').forEach(function (c) {
        $('<div class="h5p-letter">' + c + '</div>').appendTo(that.$alphabetContainer);
      });
    }

    // assign chosen word to guesses
    const guesses = that.chosenWord.word;
    for (let i = 0; i < guesses.length; i++) {
      that.$guessContainer.append('<div class="guess"></div>');
    }

    this.$taskDescription.appendTo(this.$topContainer);
    this.$alphabetContainer.appendTo(this.$leftContainer);

    this.$selectedCategory.appendTo(this.$leftContainer);
    this.$guessContainer.appendTo(this.$leftContainer);

    this.hangman.appendTo(this.$hangmanContainer, true);
    this.$hangmanContainer.appendTo(this.$rightContainer);
    this.$buttonContainer.appendTo(this.$rightContainer);

    this.$leftContainer.appendTo(this.$gameContainer);
    this.$rightContainer.appendTo(this.$gameContainer);

    this.$topContainer.appendTo(this.$container);
    this.$gameContainer.appendTo(this.$container);

    this.$taskDescription.attr('tabindex', 0).focus();

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

    that.$alphabetContainer.find('.h5p-letter').each(function () {
      $(this).keypress(function (event) {
        alert( String.fromCharCode(event.which)==$(this).innerText);
      });

    });

    // Let the first letter to be focused when clicking tab
    let $current = that.$alphabetContainer.find('.h5p-letter').first();
    that.$temp = $('<div></div>').appendTo(this.$container);
    $current.attr("tabindex", 0);

    // Clicking an alphabet or guessing a letter
    that.$alphabetContainer.find('.h5p-letter').click(function () {

      that.afterLetterClick($(this));
    })
      .keydown(function (event) {
        switch (event.which) {
          case 13: // Enter
          case 32: // Space

            if (!($(this).hasClass('h5p-letter-after-click'))) {

              that.afterLetterClick($(this));
            }
            event.preventDefault();
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
    that.trigger('resize');

  };


  /**
  * If Hangman is inline, remove inline class
  */
  Hangman.prototype.changeToInlineMode = function () {
    this.$container.find('.left-container').removeClass('inline');
    this.$container.find('.right-container').removeClass('inline');
  };

  /**
  * If Hangman is not inline, make it inline
  */
  Hangman.prototype.changeToBlockMode = function () {
    this.$container.find('.left-container').addClass('inline');
    this.$container.find('.right-container').addClass('inline');
  };

  /**
  * After clicking an alphabet
  * @param {H5P.jQuery} $letter
  */
  Hangman.prototype.afterLetterClick = function ($letter) {
    const that = this;
    that.timer.play();
    $letter.addClass("h5p-letter-after-click");
    const AriaLabel = "Clicked letter "+ $letter.text();
    that.$temp.attr('tabindex',0).focus();
    that.$temp.attr('tabindex',-1);
    $letter.attr('tabindex',0).focus();
    $letter.attr('aria-label', AriaLabel);

    const foundAt = that.checkGuess($letter.text());
    that.clickedLetters.push($letter.text());

    if (foundAt.length === 0) {
      // If the clicking letter is not found in the chosen word
      that.attemptsLeft--;
      that.counter.decrement();
      that.hangman.drawNext();
    }
    else {
      // If the clicking letter is in the chosen word
      foundAt.forEach(function (index) {
        that.$guessContainer.find('.guess')[index].innerHTML = $letter.text();
      });
      that.score = that.score + foundAt.length;
    }

    // Set maximum score to the chosen word length
    that.maxScore = that.chosenWord.word.length;

    if (that.attemptsLeft === 0) {
      // If there is no attempts left to continue the game
      that.gameWon = false;
      that.isGameFinished = true;
      that.showFinalScreen();
    }
    else if (that.maxScore === that.score) {
      // If the answer is entered correctly
      that.gameWon = true;
      that.isGameFinished = true;
      that.showFinalScreen();
    }
  };

  /**
  * Show the final screen when game is finished
  */
  Hangman.prototype.showFinalScreen = function () {
    const that = this;
    that.$container.empty();
    that.isGameStarted = false;
    that.getAnswerGiven();

    if (that.gameWon) {
      // If the answer is right
      that.$container.addClass("game-win-page");
    }
    else {
      // If the answer is wrong or if game loses
      that.$container.addClass("game-over-page");
    }
    that.createFinalScreenDomElements();

    that.$totalTimeSpent.appendTo(that.$resultDiv);
    that.$attemptsLeft.appendTo(that.$resultDiv);
    that.$progressBar.appendTo(that.$resultDiv);
    that.$resultDiv.appendTo(that.$container);
    that.$playAgain.appendTo(that.$container);

    const xAPIEvent = this.createXAPIEventTemplate('answered');
    this.addQuestionToXAPI(xAPIEvent);
    this.addResponseToXAPI(xAPIEvent);
    this.trigger(xAPIEvent);

    this.trigger('resize');
  };

  /**
  * addQuestionToXAPI - Add the question to the definition part of an xAPIEvent
  * @param {H5P.XAPIEvent} xAPIEvent
  */
  Hangman.prototype.addQuestionToXAPI = function (xAPIEvent) {
    const definition = xAPIEvent.getVerifiedStatementValue(
      ['object', 'definition']
    );
    definition.description = {
      'en-US': this.options.l10n.taskDescription
    };
    definition.type =
    'http://adlnet.gov/expapi/activities/cmi.interaction';
    definition.interactionType = 'choice';
    definition.correctResponsesPattern = [];
    definition.choices = [];

    this.alphabets.split(',').forEach(function (c,index) {
      definition.choices[index] = {
        'id': 'letter_' + c+ '',
        'description': {
          'en-US': 'letter '+c
        }
      };
    });

    const setWord = [];
    let questionWord = this.chosenWord.word;
    questionWord = questionWord.toUpperCase();
    for (let i = 0; i < questionWord.length; i++) {
      if (!setWord.includes(questionWord[i]) ) {
        setWord.push(questionWord[i]);
      }
    }

    setWord.forEach(function (letter,index) {
      if (index==0) {
        definition.correctResponsesPattern[0] = 'letter_' + letter + '[,]';
      }
      else if (index === setWord.length-1) {
        definition.correctResponsesPattern[0] += 'letter_' + letter;
      }
      else {
        definition.correctResponsesPattern[0] += 'letter_' + letter+ '[,]';
      }
    });
  };

  /**
  * Add the response part to an xAPI event.
  *
  * @param {H5P.XAPIEvent} xAPIEvent
  */
  Hangman.prototype.addResponseToXAPI = function (xAPIEvent) {
    const maxScore = this.getMaxScore();
    const score = this.getScore();
    const success = (score === maxScore);
    let response = '';

    this.clickedLetters.forEach(function (letter) {
      if (response !== '') {
        response += '[,]';
      }
      response += 'letter_' + letter;
    });

    xAPIEvent.setScoredResult(score, maxScore, this, true, success);
    xAPIEvent.data.statement.result.response = response;
  };

  /**
    * getXAPIData - Get xAPI data.
    *
    * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-6}
    * @returns {Object} xApi data statement
    */
  Hangman.prototype.getXAPIData = function () {
    const xAPIEvent = this.createXAPIEventTemplate('answered');
    this.addQuestionToXAPI(xAPIEvent);
    this.addResponseToXAPI(xAPIEvent);
    return {
      statement: xAPIEvent.data.statement
    };
  };

  /**
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
      'class': 'retry-button button',
      'html': '<span><i class="fa fa-undo" aria-hidden="true"></i></span>&nbsp;' + this.options.l10n.playAgain,
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
    that.score = 0;
    that.isInline = true;
    that.canvasSize = 0;
    that.$container.empty().removeClass('game-win-page').removeClass('game-over-page');
    that.attach(that.$container);
  };

  /**
  * Check if the guessed letter is correct or not
  * @param {string} letter
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
  */
  Hangman.prototype.getAnswerGiven = function () {
    const that = this;
    that.isCorrect = (that.gameWon) ? true:false ;
    return this.isCorrect;
  };

  /**
  * Get the score given
  * @return {number} this.score
  */
  Hangman.prototype.getScore = function () {
    return this.score;
  };

  /**
  * Get the maximum score
  * @return {number} word.length
  */
  Hangman.prototype.getMaxScore = function () {
    return this.chosenWord.word.length;
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
      'html': '<span><i class="fa fa-check-square-o" aria-hidden="true"></i></span>&nbsp;' + that.options.l10n.startGame,
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

    // when resize event triggers
    that.on('resize', function () {
      if (that.isGameStarted) {
        if (window.innerWidth >= window.innerHeight) {
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

            that.isInline=false;
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

    that.trigger('resize');
  };

  return Hangman;
})(H5P.jQuery, H5P.JoubelUI, H5P.EventDispatcher);
