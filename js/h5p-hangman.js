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
    let that = this;
    EventDispatcher.call(self);
    that.options = options;
    // Keep provided id.
    that.id = id;
    this.MIN_WIDTH = 300;
    this.MIN_HEIGHT = 560;
    this.MIN_IMAGE_WIDTH = 300;
    this.MIN_IMAGE_HEIGHT = 400;
  }

  /**
   * Game starts
   */
  Hangman.prototype.startGame = function ($container) {
    let that = this;
    $container.empty();

    // Create DOM elements
    const $wrapper = $('<div class="h5p-hangman-wrapper"></div>');
    const $topDiv = $('<div class = "top-div"></div>');
    const $gameContainer = $('<div class = "game-container"></div>');
    const $leftGameContainer = $('<div class = "left-game-container"></div>');
    const $rightGameContainer = $('<div class = "right-game-container"></div>');
    const $drawHangman = $('<div class = "h5p-draw-hangman" id="draw"></div>');
    const $canvasDiv = $('<canvas name ="canvas" id="canvas"></canvas>');
    const $footContainer = $('<div class = "foot-container"></div>');
    const $buttonContainer = $('<div class = "h5p-button-container"></div>');
    const $guessesContainer = $('<div class = "guess-container"></div>');

    // Add status bar
    const $status = $('<div class="h5p-status">' +
      '<div  style= "display:inline-block" class="h5p-time-spent"><time role="timer" datetime="PT00H00M0S">00:00:00</time></div>' +
      '<div class = "h5p-attempts-left" style= " display:inline-block"> Attempts left : <span>' + that.levelChosen + '</span></div>' +
      '</div>');
    let timer = new Hangman.Timer($status.find('time')[0]);

    // Task description
    const $taskDescription = $('<p> Use the alphabets below to guess the word, or click the hint to get a clue </p>');

    // Define wordlist and hintlist
    let wordList = [];
    let hintList = [];
    for (let i = 0; i < that.options.categorySelectionList.length; i++) {
      if (that.options.categorySelectionList[i].categoryText === that.categoryChosen) {
        for (let j = 0; j < that.options.categorySelectionList[i].categoryWordList.length; j++) {
          let word = that.options.categorySelectionList[i].categoryWordList[j].word;
          word = word.replace(/ /g, '');
          word = word.toUpperCase();
          wordList.push(word);
        }
        for (let k = 0; k < that.options.categorySelectionList[i].categoryWordList.length; k++) {
          let hint = that.options.categorySelectionList[i].categoryWordList[k].hintText;
          hint = hint.toUpperCase();
          hintList.push(hint);
        }
      }
    }

    // Get randomized word
    let randomIndex = Math.floor(Math.random() * wordList.length);
    let randomizedWord = wordList[randomIndex];
    let hintWord = hintList[randomIndex];
    that.guesses = [];

    for (let i = 0; i < randomizedWord.length; i++) {

      // Create guess
      let guess = document.createElement('li');
      guess.setAttribute('class', 'guess');

      if (randomizedWord[i] === " ") {

        // If space present in randomized word
        guess.innerHTML = " ";
      }
      else {
        guess.innerHTML = "_";
      }
      that.guesses.push(guess);
    }

    //	Alphabets
    const $alphabets = $('<div class="alphabet-container"></div>');
    let letter;
    for (let i = 65; i <= 90; i++) {
      letter = String.fromCharCode(i);
      let $letter = $('<button class="h5p-letter">' + letter + '</button>').appendTo($alphabets);
      $letter.click(function () {

        // After clicking a letter
        that.afterLetterClick($(this), randomizedWord, that.guesses, timer);
      });
    }

    // Total attempts
    this.attempts = that.levelChosen;

    // Define popup
    let popup = new Hangman.Popup($container);

    // Hint button
    that.$hint = UI.createButton({
      title: 'Hint',
      'text': 'Hint',
      'class': 'hint-button',
      click: function () {

        // When clicking hint button, stop the timer and show popup window
        timer.stop();
        popup.show(hintWord, function () {
          $container.addClass('h5p-hangman-shadow');
        });
      }
    });

    $('.h5p-hangman-pop').find('.h5p-hangman-close').click(function () {

      // When popup window closed , resume timer
      timer.play();
      popup.close();
    });

    // Retry button
    that.$playAgain = UI.createButton({
      title: 'retry',
      'text': 'Play Again',
      'class': 'play-again-button',
      click: function () {
        $container.empty();
        that.guesses = [];
        that.attach($container);
      }
    });

    // Append all elements
    $(".container-landscape").css('background-size', "0");
    $status.appendTo($topDiv);
    $taskDescription.appendTo($leftGameContainer);
    $alphabets.appendTo($leftGameContainer);
    $('<p>The chosen category is ' + that.categoryChosen + '</p>').appendTo($guessesContainer);
    $guessesContainer.append(that.guesses);
    $guessesContainer.appendTo($leftGameContainer);
    $topDiv.appendTo($wrapper);
    $canvasDiv.appendTo($drawHangman);
    $drawHangman.appendTo($rightGameContainer);
    $leftGameContainer.appendTo($gameContainer);
    $rightGameContainer.appendTo($gameContainer);
    $gameContainer.appendTo($wrapper);
    $guessesContainer.appendTo($footContainer);
    that.$hint.appendTo($buttonContainer);
    that.$playAgain.appendTo($buttonContainer);
    $buttonContainer.appendTo($footContainer);
    $footContainer.appendTo($wrapper);
    $wrapper.appendTo($container);

    that.trigger('resize');
  };

  /**
   * After a letter is clicked
   * @param {H5P.Hangman.Timer} timer
   */
  Hangman.prototype.afterLetterClick = function ($letter, randomizedWord, guesses, timer) {
    let that = this;

    //start timer when a letter is clicked
    timer.play();

    $letter.attr('disabled', true);
    if ($letter.hasClass("h5p-letter")) {
      $letter.removeClass("h5p-letter");
    }

    let flag = 0;
    let counter = 0;
    $letter.addClass("h5p-letter-selected");

    for (let i = 0; i < randomizedWord.length; i++) {
      let guess = guesses[i];

      if (randomizedWord[i] === $letter[0].innerHTML) {

        guess.innerHTML = $letter[0].innerHTML;
        $(guess).addClass("guess-after-click");
        flag = 1;
      }

      if ((guesses[i].innerHTML === randomizedWord[i])) {
        // If clicked letter is correct, increment the counter
        counter++;
      }
    }

    // Set score
    this.max = randomizedWord.length;
    this.score = counter;

    // If clicked letter is wrong
    if (flag !== 1) {
      that.levelChosen--;
      if (that.levelChosen === 0) {
        timer.stop();
      }
      if (that.levelChosen < 0) {
        that.levelChosen = 0;
      }
      that.levelChosen = '0' + that.levelChosen;

      // Decrement attempts left
      $(".h5p-attempts-left>span")[0].innerHTML = that.levelChosen;
      this.attemptsLeft = $(".h5p-attempts-left>span")[0].innerHTML;

      // Draw hangman if wrong attempts made
      this.drawHangman(this.$container, timer);
    }
    else if (flag === 1) {

      // if attempts made is correct
      this.attemptsLeft = that.levelChosen;
    }

    if (randomizedWord.length === counter) {

      // if all the attempts made is correct
      this.afterWinGame($(".h5p-hangman"), timer);
    }
  };


  /**
   * Draw Hangman function
   *
   */
  Hangman.prototype.drawHangman = function ($container, timer) {
    let that = this;
    let canvas = $('.h5p-draw-hangman').find('canvas')[0];

    // set height of the canvas equal to width
    canvas.height = canvas.width;
    let width = canvas.width;
    let height = canvas.height;

    let unitHt = height / 6;
    let unitWt = width / 6;
    let unit = 2;
    let centerX = canvas.width / 1.7;
    let centerY = canvas.height / 5.8;
    let radius = 25;

    // Head of the man
    let head = function () {
      let context = canvas.getContext("2d");
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      context.lineWidth = 5;
      context.strokeStyle = '#0ebb7a';
      context.stroke();
    };

    let line = function ($pathFromX, $pathFromY, $pathToX, $pathToY, $color, $lineWidth) {
      let context = canvas.getContext('2d');
      context.strokeStyle = $color;
      context.lineWidth = $lineWidth;
      context.beginPath();
      context.moveTo($pathFromX, $pathFromY);
      context.lineTo($pathToX, $pathToY);
      context.stroke();
      context.closePath();
    };

    // create an array to place the components in order
    let drawArray = [];


    const frame1 = function () {
      line(unitHt - unitWt, height - 5, width, height - 5, "#ea622c", 10);
    };

    const frame2 = function () {
      line(unitWt, height - 2, unitWt, unitHt - unitWt, "#ea622c", 10);
    };

    const frame3 = function () {
      line(unitWt, unitHt - unitWt + 2 * unit, 4.5 * unitWt, unitHt - unitWt + 2 * unit, "#ea622c", 10);
    };

    const frame4 = function () {
      line(3.5 * unitWt, unitHt - unitWt + unit * 4, 3.5 * unitWt, unitHt / 2, "#edb41e", 5);
    };

    const torso = function () {
      line(3.5 * unitWt, unitHt / 2.2 + 2 * radius + 2.5 * unit, 3.5 * unitWt, unitHt * 3.3, "#0ebb7a", 5);
    };

    const rightArm = function () {
      line(3.5 * unitWt, unitHt * 2.2, 4.5 * unitWt, unitHt * 2.7, "#0ebb7a", 5);
    };

    const leftArm = function () {
      line(3.5 * unitWt, unitHt * 2.2, 2.5 * unitWt, unitHt * 2.7, "#0ebb7a", 5);
    };

    const rightLeg = function () {
      line(3.5 * unitWt, unitHt * 3.3, 4.5 * unitWt, unitHt * 4.3, "#0ebb7a", 5);
    };

    const leftLeg = function () {
      line(3.5 * unitWt, unitHt * 3.3, 2.5 * unitWt, unitHt * 4.3, "#0ebb7a", 5);
    };

    // Add components to draw hangman array in order
    drawArray.push(rightLeg, leftLeg, rightArm, leftArm, torso, head, frame4, frame3, frame2, frame1);


    let levels = drawArray.length;
    if (that.levelChosen > 0) {
      while (levels > that.levelChosen) {
        drawArray[levels - 1]();
        levels--;
      }
    }
    else if (that.levelChosen === 0) {
      timer.stop();
    }
    else {
      // if all attempts are made
      this.gameOver($(".h5p-hangman"), timer);
    }

  };

  /**
   * If wins
   *
   */
  Hangman.prototype.afterWinGame = function ($container, timer) {
    let that = this;
    $container.empty();
    $container.addClass("game-win-page");
    const $resultDiv = $('<div class="h5p-result-div"></div>');
    let time = timer.getTime();
    time = time / 1000;
    time = time.toFixed(0);
    // console.log(time);
    let minutes = Math.floor(time / 60);
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    let seconds = time % 60;
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    time = '00:' + minutes + ':' + seconds;
    $('<p class="total-time-spent">Time spent ' + '<span>' + time + '</span></p>').appendTo($resultDiv);

    $('<p class="total-attempts-made">Attempts left  ' + '<span>' + (this.attemptsLeft) + '</span></p>').appendTo($resultDiv);
    // console.log(that.levelChosen, this.attempts, this.attemptsLeft);
    that.$progressBar = UI.createScoreBar(this.max);
    that.$progressBar.setScore(this.score);

    that.$progressBar.appendTo($resultDiv);
    $resultDiv.appendTo($container);
    that.$playAgain = UI.createButton({
      title: 'retry',
      'text': 'Play Again',
      'class': 'play-again-button',
      click: function () {
        that.guesses = [];
        $container.removeClass("game-win-page");
        $container.empty();
        that.attach($container);
      }
    }).appendTo($container);

  };


  /**
   * If game is over / no attempts left
   *
   */
  Hangman.prototype.gameOver = function ($container, timer) {
    let that = this;
    $container.empty();
    $container.addClass("game-over-page");
    const $resultDiv = $('<div class="h5p-result-div"></div>');

    // Caluclate the time
    let time = timer.getTime();
    time = time / 1000;
    time = time.toFixed(0);
    let minutes = Math.floor(time / 60);
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    let seconds = time % 60;
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    time = '00:' + minutes + ':' + seconds;
    $('<p class="total-time-spent">Time spent ' + '<span>' + time + '</span></p>').appendTo($resultDiv);

    $('<p class="total-attempts-made">Attempts left  ' + '<span>' + (this.attemptsLeft) + '</span></p>').appendTo($resultDiv);

    that.$progressBar = UI.createScoreBar(this.max);
    that.$progressBar.setScore(this.score);
    that.$progressBar.appendTo($resultDiv);
    $resultDiv.appendTo($container);

    that.$playAgain = UI.createButton({
      title: 'retry',
      'text': 'Play Again',
      'class': 'play-again-button',
      click: function () {
        $container.empty();
        $container.removeClass("game-over-page");
        that.guesses = [];
        that.attach($container);
      }
    }).appendTo($container);

  };

  /**
   * Attach this game's html to the given container
   *
   * @param {H5P.jQuery} $container
   */
  Hangman.prototype.attach = function ($container) {
    let that = this;
    $container.addClass("h5p-hangman");

    const $wrapper = $('<div class="hangman-wrapper"></div>');
    const imgSrc = $(".h5p-hangman").css('background-image').replace('url("', '').replace('")', '');
    $('<img class="bgImage" src = ' + imgSrc + ' />').css('height', "95%").appendTo($wrapper);

    const $selectContainer = $('<div class="select-container"></div>');

    const $categorySelect = $('<select name="category" class="category sources" placeholder="Chose Category">' +
      '</select>');
    $('<div class="arrow-left"></div>').appendTo($selectContainer);
    $('<option value="' + that.options.categorySelectionList[0].categoryText + '" selected class="options-select">' + that.options.categorySelectionList[0].categoryText + '</option>').appendTo($categorySelect);
    for (let i = 1; i < that.options.categorySelectionList.length; i++) {
      $('<option value="' + that.options.categorySelectionList[i].categoryText + '" class="options-select">' + that.options.categorySelectionList[i].categoryText + '</option>').appendTo($categorySelect);

    }
    $categorySelect.appendTo($selectContainer);

    $('<select class="level sources" placeholder="Difficult level">' +
      '<div class="custom-option">' +
      '<option value="10" selected class="options-select">Level 10</option>' +
      '<option value="9" class="options-select">Level 9</option>' +
      '<option value="8" class="options-select">Level 8</option>' +
      '<option value="7" class="options-select">Level 7</option>' +
      '<option value="6" class="options-select">Level 6</option></div>' +
      '</select>').appendTo($selectContainer);

    that.categoryChosen = $selectContainer.find('.category').val();
    $selectContainer.find('.category').on('change', function () {
      that.categoryChosen = this.value;
    });

    that.levelChosen = $selectContainer.find('.level').val();
    $selectContainer.find('.level').on('change', function () {
      that.levelChosen = this.value;
    });


    const start = function () {
      // If value of level and category is not null / undefined
      if ($(".level").value !== "" && $(".category").value !== "") {
        that.startGame($container);
      }
    };

    // Start game button
    that.$startGame = UI.createButton({
      title: 'retry',
      'text': 'Start Game',
      'class': 'start-button',
      click: function () {
        start();
      }
    });

    $selectContainer.appendTo($wrapper);
    that.$startGame.appendTo($wrapper);
    $wrapper.appendTo($container);

    that.trigger("resize");

  };

  return Hangman;

})(H5P.jQuery, H5P.JoubelUI, H5P.EventDispatcher);
