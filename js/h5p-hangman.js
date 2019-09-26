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
    that.options = $.extend(true, {
      taskDescription: "Save the man from hanging!",
      behaviour: {
        "showCorrectGuesses": true
      },
      l10n: {
        "chosenCategory": "The chosen category is",
        "attemptsLeft": "Attempts Left",
        "timeSpent": "Time Spent",
        "score": "You got @score of @total points",
        "hangmanTitle": "Hangman",
        "successMsg": "You Won!",
        "lostMsg": "You Lost!"
      }
    }, options);

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
      '<option value="10" selected class="options-select">10 '+that.options.l10n.attemptsText+'</option>' +
      '<option value="9" class="options-select">9 '+that.options.l10n.attemptsText+'</option>' +
      '<option value="8" class="options-select">8 '+that.options.l10n.attemptsText+'</option>' +
      '<option value="7" class="options-select">7 '+that.options.l10n.attemptsText+'</option>' +
      '<option value="6" class="options-select">6 '+that.options.l10n.attemptsText+'</option>' +
      '</select>');
  };

  /**
   * Register game screen DOM elements
   */
  Hangman.prototype.createGameScreenDomElements = function () {
    const that = this;

    that.$status = $('<div class="h5p-status">' +
      '<div class="h5p-time-spent"><time role="timer" datetime="PT00H00M0S">00:00:00</time></div>' +
      '<div class = "h5p-attempts-left"> ' + that.options.l10n.attemptsLeft + ': <span>' + that.levelChosen + '</span></div>' +
      '</div>');

    that.timer = new Hangman.Timer(that.$status.find('time')[0]);
    that.counter = new Hangman.Counter(that.$status.find('span'));
    that.hangman = new Hangman.HangmanVector(that.levelChosen);
    that.popup = new Hangman.Popup(that.$container);

    that.$taskDescription = $('<div class="task-description">' + that.options.taskDescription + '</div>');
    that.$alphabetContainer = $('<div class="alphabet-container"></div>');
    that.$selectedCategory = $('<p>'+that.options.l10n.chosenCategory+'&nbsp;<span>' + that.categoryChosen + '</span></p>');
    that.$guessContainer = $('<div class="guess-container"></div>');

    that.$hangmanContainer = $('<div class="hangman-container"></div>');
    that.$footerButtonContainer = $('<div class="footer-button-container"></div>');

    that.$leftContainer = $('<div class="left-container"></div>');
    that.$rightContainer = $('<div class="right-container"></div>');

    that.$topContainer = $('<div class="top-container"></div>');
    that.$gameContainer = $('<div class="game-container"></div>');

    that.$mainContainer = $('<div class="main-container"></div>');

    // Play again button
    const callBackFunction = that.resetTask.bind(this);
    that.$playAgainButton = UI.createButton({
      'class': 'retry-button button',
      'html': '<span><i class="fa fa-undo" aria-hidden="true"></i></span>&nbsp;' + this.options.l10n.playAgain,
      click: callBackFunction
    }).appendTo(that.$footerButtonContainer);

    // Hint button
    if (that.chosenWord.hint) {
      that.$hintButton = UI.createButton({
        'html': '<span><i class="fa fa-info-circle" aria-hidden="true"></i></span>&nbsp;' + that.options.l10n.hint,
        'class': 'hint-button button',
        click: function () {
          that.popup.show(that.chosenWord.hint);
        }
      }).appendTo(that.$footerButtonContainer);
    }

  };

  /**
   * Game starts when the start game button clicked
   */
  Hangman.prototype.startGame = function () {
    const that = this;
    that.isGameStarted = true;
    that.alphabets = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z';
    that.customKeys = that.options.customKeys;
    that.keys = this.options.keys.replace(/[\s,.:'"!@#$%^&*()-_=+\\|]/g, '');
    that.score = 0;
    that.clickedLetters = [];

    //get a radomised word from the chosen category
    that.getWord();
    that.$container.empty().removeClass('first-screen').addClass('second-screen');
    that.createGameScreenDomElements();
    that.$status.appendTo(that.$topContainer);

    // assign levelchosen to attempts left
    that.attemptsLeft = that.levelChosen;

    // Get each alphabet
    if (that.customKeys) {
      this.keys.split('').forEach(function (c) {
        $('<div class="h5p-letter" id="letter_'+c+'">' + c + '</div>').appendTo(that.$alphabetContainer);
      });
    }
    else {
      this.alphabets.split(',').forEach(function (c) {
        $('<div class="h5p-letter" id="letter_'+c+'">' + c + '</div>').appendTo(that.$alphabetContainer);
      });
    }

    // assign chosen word to guesses
    const guesses = that.chosenWord.word;
    for (let i = 0; i < guesses.length; i++) {
      let $guess = $('<div class="guess"></div>');
      if (guesses[i] === ' ') {
        $guess.removeClass('guess');
        $guess.addClass('guess-whitespace');
      }
      that.$guessContainer.append($guess);
    }

    that.$taskDescription.appendTo(that.$topContainer);
    that.$alphabetContainer.appendTo(that.$leftContainer);

    that.$selectedCategory.appendTo(that.$leftContainer);
    that.$guessContainer.appendTo(that.$leftContainer);

    that.hangman.appendTo(that.$hangmanContainer, true);
    that.$hangmanContainer.appendTo(that.$rightContainer);
    that.$footerButtonContainer.appendTo(that.$rightContainer);

    that.$leftContainer.appendTo(that.$gameContainer);
    that.$rightContainer.appendTo(that.$gameContainer);

    that.$topContainer.appendTo(that.$container);
    that.$gameContainer.appendTo(that.$container);

    that.$taskDescription.attr('tabindex', 0).focus();

    that.on('changeHangmanContainer', function () {
      that.$hangmanContainer.empty();
      if (that.isInline) {
        that.hangman.appendTo(that.$hangmanContainer, that.canvasSize);
        that.changeToInlineMode();
      }
      else {
        that.hangman.appendTo(that.$hangmanContainer, that.canvasSize);
        that.changeToBlockMode();
      }

      that.hangman.redraw(that.attemptsLeft);
      that.$container.css({
        'height': 'auto'
      });
    });


    // Let the first letter to be focused when clicking tab
    let $current = that.$alphabetContainer.find('.h5p-letter').first();
    that.$temp = $('<div></div>').appendTo(that.$container);
    $current.attr("tabindex", 0);

    // Clicking an alphabet or guessing a letter
    $(window).keypress(function (event) {
      let inp = String.fromCharCode(event.keyCode);
      inp = inp.toUpperCase();
      if (/[a-zA-Z]/.test(inp)) {
        // find the element and if it is not already clicked, triggers
        const $element = that.$alphabetContainer.find('#letter_' + inp);
        if ($element && !$element.hasClass('h5p-letter-after-click')) {
          that.afterLetterClick($element);
        }
      }
    });

    that.$alphabetContainer.find('.h5p-letter').click(function () {
      that.afterLetterClick($(this));
    })
      .keydown(function (event) {
        //check if it is a character

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
    const AriaLabel = "Clicked letter " + $letter.text();
    that.$temp.attr('tabindex', 0).focus();
    that.$temp.attr('tabindex', -1);
    $letter.attr('tabindex', 0).focus();
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
    this.spaceCount = 0;
    for (let i=0; i<that.chosenWord.word.length; i++) {
      if (that.chosenWord.word[i] === ' ') {
        this.spaceCount++;
      }
    }

    that.maxScore = that.chosenWord.word.length - this.spaceCount;

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
      // that.triggerXAPICompleted(that.score, that.maxScore, true);
      const $wrapper = $('<div/>', {
        'class': 'content-wrapper'
      });
      $('<div/>', {
        'class': 'image-icon image-won'
      }).appendTo($wrapper);

      $('<h1 tabindex="0"> ' + that.options.l10n.successMsg + ' </h1>').appendTo($wrapper);
      // TODO: translatable string

      $wrapper.appendTo(that.$container);
      that.$container.removeClass("second-screen").addClass("game-over-page");
    }
    else {
      // If the answer is wrong or if game loses
      // that.triggerXAPIScored(that.score, that.maxScore, false);
      const $wrapper = $('<div/>', {
        'class': 'content-wrapper'
      });

      $('<div/>', {
        'class': 'image-icon image-lost'
      }).appendTo($wrapper);

      $('<h1 tabindex="0"> ' + that.options.l10n.lostMsg + ' </h1>').appendTo($wrapper);
      $wrapper.appendTo(that.$container);

      that.$container.removeClass("second-screen").addClass("game-over-page");
    }
    that.createFinalScreenDomElements();

    that.$guessedWord.appendTo(that.$resultContentDiv);
    that.$totalTimeSpent.appendTo(that.$resultContentDiv);
    that.$attemptsLeft.appendTo(that.$resultContentDiv);

    if (that.options.behaviour) {
      that.$counter.find('.h5p-counter').html(that.score);
      that.$counter.appendTo(that.$resultContentDiv);
      that.$progressBar.appendTo(that.$resultContentDiv);
    }

    that.$resultContentDiv.appendTo(that.$resultDiv);
    that.$playAgain.appendTo(that.$resultDiv);
    that.$resultDiv.appendTo(that.$container);


    const xAPIEvent = that.createXAPIEventTemplate('answered');
    that.addQuestionToXAPI(xAPIEvent);
    that.addResponseToXAPI(xAPIEvent);
    that.trigger(xAPIEvent);
    that.trigger('resize');
  };


  /**
   * addQuestionToXAPI - Add the question to the definition part of an xAPIEvent
   *
   * @param {H5P.XAPIEvent} xAPIEvent
   */
  Hangman.prototype.addQuestionToXAPI = function (xAPIEvent) {

    const definition = xAPIEvent.getVerifiedStatementValue(
      ['object', 'definition']
    );
    definition.description = {
      'en-US': this.options.taskDescription
    };
    definition.type =
      'http://adlnet.gov/expapi/activities/cmi.interaction';
    definition.interactionType = 'choices';
    definition.correctResponsesPattern = [];
    definition.choices = [];
    this.alphabets.split(',').forEach(function (c, index) {
      definition.choices[index] = {
        'id': 'letter_' + c + '',
        'description': {
          'en-US': 'letter ' + c
        }
      };
    });

    const setWord = [];
    const questionWord = this.chosenWord.word;
    for (let i = 0; i < questionWord.length; i++) {
      if (!setWord.includes(questionWord[i])) {
        setWord.push(questionWord[i]);
      }
    }

    setWord.forEach(function (letter, index) {
      if (index == 0) {
        definition.correctResponsesPattern[0] = 'letter_' + letter + '[,]';
      }
      else if (index === setWord.length - 1) {
        definition.correctResponsesPattern[0] += 'letter_' + letter;
      }
      else {
        definition.correctResponsesPattern[0] += 'letter_' + letter + '[,]';
      }
    });
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
    that.$resultDiv = $('<div class="result-div"></div>');
    that.$resultContentDiv = $('<div class="result-content-div"></div>');
    that.$guessedWord = $('<p class="guessed-word" tabindex="0">' + that.options.l10n.guessedWord + '&nbsp;:&nbsp;<span>' + that.chosenWord.word + '</span></p>');
    that.$totalTimeSpent = $('<p class="total-time-spent" tabindex="0">' + that.options.l10n.timeSpent + '&nbsp;:&nbsp;<span>' + that.$status.find('time')[0].innerHTML + '</span></p>');
    that.$attemptsLeft = $('<p class="total-attempts-made" tabindex="0">' + that.options.l10n.attemptsLeft + '&nbsp;:&nbsp;<span>' + that.attemptsLeft + '</span></p>');

    // Create progress bar
    if (that.options.behaviour) {

      const counterText = that.options.l10n.score
        .replace('@total', '<span>' + that.getMaxScore() + '</span>')
        .replace('@score', '<span class="h5p-counter" ><strong>0</strong></span>');

      that.$counter = $('<div/>', {
        class: 'counter-status',
        tabindex: 0,
        html: '<div role="term"><span role="definition">' + counterText + '</span></div>'
      });
    }
    that.$progressBar = UI.createScoreBar(that.maxScore);
    // Set score to the count of correct letter clicked
    that.$progressBar.setScore(that.score);
    const callBackFunction = that.resetTask.bind(that);
    that.$playAgain = UI.createButton({
      'class': 'retry-button button',
      'html': '<span><i class="fa fa-undo" aria-hidden="true"></i></span>&nbsp;' + that.options.l10n.playAgain,
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
    that.$container.empty().removeClass('game-win-page').removeClass('game-over-page').removeClass('second-screen');
    that.attach(that.$container);
  };

  /**
   * Check if the guessed letter is correct or not
   * @param {string} letter
   */
  Hangman.prototype.checkGuess = function (letter) {
    const that = this;
    const foundAt = [];
    const currentWord = that.chosenWord.word.toUpperCase().replace(/\s/g,'');
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
    that.isCorrect = (that.gameWon) ? true : false;
    return that.isCorrect;
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
    return this.maxScore;
  };

  /**
   * Get randomized word
   */
  Hangman.prototype.getWord = function () {

    const that = this;
    const wordListObj = that.options.categorySelectionList.filter(function (category) {
      return category.categoryText === that.categoryChosen;
    });

    // Define a wordlist containing word and it's hint
    that.wordList = wordListObj[0].categoryWordList.map(function (obj) {
      return ({
        "word": obj.word,
        "hint": obj.hintText
      });
    });

    const randomIndex = Math.floor(Math.random() * that.wordList.length);
    that.chosenWord = that.wordList[randomIndex];
  };

  /**
   * Attach all elements to container
   * @param {H5P.jQuery} $container The object which our task will attach to.
   */
  Hangman.prototype.attach = function ($container) {
    const that = this;
    $container.addClass('h5p-hangman').addClass('first-screen');
    const $title = $('<h1 tabindex="0">' + that.options.l10n.hangmanTitle + ' </h1>');
    const $img = $('<div/>', {
      'class': 'image-icon image-lost'
    });
    const $contentWrapper = $('<div/>', {
      'class': 'content-wrapper'
    });
    const $buttonContainer = $('<div />', {
      'class': 'button-container'
    });
    const $selectContainer = $('<div />', {
      'class': 'select-container'
    });
    const cFunction = that.startGame.bind(this);
    that.$startGameButton = UI.createButton({
      'title': 'Start the Game',
      'html': '<span><i class="fa fa-check-square-o" aria-hidden="true"></i></span>&nbsp;' + that.options.l10n.startGame,
      'class': 'start-button button',
      click: cFunction
    });

    $img.appendTo($contentWrapper);
    $title.appendTo($contentWrapper);
    that.$categorySelect.appendTo($selectContainer);
    that.$levelSelect.appendTo($selectContainer);
    $selectContainer.appendTo($contentWrapper);
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

            that.isInline = false;
            that.trigger('changeHangmanContainer');
          }
        }
      }
    });
    that.trigger('resize');
  };

  return Hangman;
})(H5P.jQuery, H5P.JoubelUI, H5P.EventDispatcher);
