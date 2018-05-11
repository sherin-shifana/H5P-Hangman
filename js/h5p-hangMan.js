H5P.HangMan = (function($, UI) {
    var self = this;
    var livesChoosen;
    var alphabet = [];
    var i;
    var guesses = [];
    var categoryChoosen;
    var counter = 0;


    function HangMan(options, id) {

        self.options = options;
        // Keep provided id.
        self.id = id;

        StartGame = function($container, livesChoosen, categoryChoosen) {

            console.log(arguments[1]);
            console.log(categoryChoosen);
            // var temp;
            // temp = arguments[1].value;

            $container.empty();

            var $DivTop = $('<div class="top-div"> </div>');
            if (livesChoosen < 10) {
                livesChoosen = 0 + livesChoosen
            }
            StartTimer = function() {
                //console.log("StartTimer");
                self.$status = $('<span>' + '<dl class="sequencing-status" style="display: inline-block;">' + '<dt>' + '</dt>' + '<dd class="h5p-time-spent" id="time-spent">00:00:00</dd>' +
                    '<dt>' + '</dt>' + '</dl>' + '<span style="color:white;font-weight:bold;">No. of lives Left </span><span class = "top-div-left" id="lives-left">' + livesChoosen + '</span>');
                self.$status.appendTo($container);
                self.timer = new HangMan.Timer(self.$status.find('.h5p-time-spent')[0]); //Initialize timer
                //after clicking play
                self.timer.play();
            }
            $container.append($DivTop);
            StartTimer();

            //  $DivTop.append('<span class = "top-div-left" style="padding-left:550px;"> Lives Left:</span>');
            var $gameContainer = $('<div class= "game-container">').appendTo($container);
            var $DivLeft = $('<div class="div-left"><p>Use the alphabets below to guess the word, or click hint to get a clue.</p> <p>The chosen category is <span class="selected-category">' + self.options.CategorySelectionList[categoryChoosen].CategoryText + '</span></p><br />  </div>').appendTo($gameContainer);
            var $blankSpace = $('<div></div>').appendTo($DivLeft);
            $('<br />').appendTo($DivLeft);
            // console.log(categoryChoosen.CategoryWordList[0].hintText);
            var wordList = [];
            var hintList = [];
            for (i = 0; i < self.options.CategorySelectionList[categoryChoosen].CategoryWordList.length; i++) {
                var word = self.options.CategorySelectionList[categoryChoosen].CategoryWordList[i].EnterWord;
                word = word.replace(/ /g, '');
                word = word.toUpperCase();
                wordList.push(word);
            }
            for (i = 0; i < self.options.CategorySelectionList[categoryChoosen].CategoryWordList.length; i++) {
                var hint = self.options.CategorySelectionList[categoryChoosen].CategoryWordList[i].hintText;
                hintList.push(hint);

            }


            console.log(wordList);
            var randomIndex = Math.floor(Math.random() * wordList.length);
            var wordChoosen = wordList[randomIndex];
            var hintChoosen = hintList[randomIndex];
            console.log(wordChoosen);


            for (i = 0; i < wordChoosen.length; i++) {

                var guess = document.createElement('li');

                guess.setAttribute('class', 'guess');
                if (wordChoosen[i] === " ") {
                    guess.innerHTML = " ";
                    space = 1;

                } else {
                    guess.innerHTML = "_";
                }
                guesses.push(guess);

            }


            $blankSpace.append(guesses);

            var showLives = document.getElementById("lives-left");
            comments = function() {

                showLives.innerHTML = 0 + livesChoosen;

                if (livesChoosen < 1) {
                    showLives.innerHTML = 0;
                }


            }
            var animate = function() {
                var drawMe = livesChoosen;

                drawArray[drawMe]();

            }
            newAnimate = function(livesChoosen,$canvasDiv){
              if(livesChoosen!==drawArray.length){
                var drawArrayNew = drawArray.slice((livesChoosen+1),drawArray.length);
                var constDrawMe = livesChoosen;
                while(constDrawMe<=10){
                  drawArray[constDrawMe]();
                  constDrawMe++;
                }
              }
            }

            

            canvas = function() {

                myStickman = document.getElementById("canvas-div");
                context = myStickman.getContext('2d');
                context.beginPath();


            };

            head = function() {
                myStickman = document.getElementById("canvas-div");
                context = myStickman.getContext('2d');
                context.beginPath();
                context.strokeStyle = "#00ff55";

                context.arc(60, 25, 10, 0, Math.PI * 2, true);
                context.stroke();
            }

            draw = function($pathFromx, $pathFromy, $pathTox, $pathToy , $Color , $lineWidth) {
                myStickman = document.getElementById("canvas-div");
                context = myStickman.getContext('2d');
                context.strokeStyle = $Color;
                context.lineWidth = $lineWidth;
                context.beginPath();
                context.moveTo($pathFromx, $pathFromy);
                context.lineTo($pathTox, $pathToy);
                context.stroke();
                context.closePath();
            }

            frame1 = function() {
                draw(0, 150, 150, 150, "#ff6600",5);
            };

            frame2 = function() {
                draw(10, 0, 10, 600,"#ff6600",5);
            };

            frame3 = function() {
                draw(0, 5, 70, 5,"#ff6600",5);
            };

            frame4 = function() {
                draw(60, 5, 60, 15,"#ffdb4d",3);
            };

            torso = function() {
                draw(60, 36, 60, 70,"#00ff55",2.2);
            };

            rightArm = function() {
                draw(60, 46, 80, 65,"#00ff55",2.2);
            };

            leftArm = function() {
                draw(60, 46, 40, 65,"#00ff55",2.3);
            };

            rightLeg = function() {
                draw(60, 70, 80, 95,"#00ff55",2.3);
            };

            leftLeg = function() {
                draw(60, 70, 40, 95,"#00ff55",2.3);
            };

            drawArray = [rightLeg, leftLeg, rightArm, leftArm, torso, head, frame4, frame3, frame2, frame1];




            alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            for (i = 0; i < alphabet.length; i++) {

                var $letter = $('<button class="div-alpha">' + alphabet[i] + '</button>').appendTo($DivLeft);


                $letter.click(function() {
                    $(this).attr("disabled", true);
                    var flag = 0;
                    for (i = 0; i < wordChoosen.length; i++) {
                        if (wordChoosen[i] == this.innerHTML) {

                            guesses[i].innerHTML = this.innerHTML;
                            flag = 1;
                            counter++;
                        }
                    }


                    if (flag !== 1) {
                        livesChoosen -= 1;

                        comments();
                        animate();

                        setTimeout(function(){
                          if (livesChoosen === 0) {
                              $gameContainer.empty();
                              var $failed = $("<p>The Game Is Over :( </p>").appendTo($container);
                              gameOver();

                          }
                        },1000);


                    }
                    if (wordChoosen.length === counter) {

                        $gameContainer.empty();
                        var $success = $('<p><span style="font-weight:bold"> You Won !!!</span></p>').appendTo($container);
                        gameOver();
                    }

                });
                var gameOver = function() {
                    self.timer.stop();

                    console.log(document.getElementById("time-spent").innerHTML);
                    var $timeSpent = $('<p><span style="font-weight:bold">Time Spent:</span>' + document.getElementById("time-spent").innerHTML + '</p>').appendTo($container);
                    // var $livesLeft = $('<p>'+showLives.innerHTML+'</p>').appendTo($container);


                    self.$Retry = UI.createButton({
                        title: 'Retry',
                        'text': 'Retry',
                        click: function(event) {
                            // StartGame($container,livesChoosen,categoryChoosen);
                            $container.empty();
                            guesses = [];
                            counter = 0;

                            HangMan.prototype.attach($container);
                        }
                    });
                    $gameContainer.append(self.$Retry);
                }
            }
            $gameContainer.append($DivLeft);
            var $DivRight = $('<div class="div-right"></div>');
            var $innerDivRight = $('<div id="inner-div-right"></div>').appendTo($DivRight);

            var $canvasDiv = $('<canvas id="canvas-div"></canvas>');

            $canvasDiv.appendTo($innerDivRight);


            var $DivBottom = $('<div class="div-bottom" style = "padding-top:25px;"> </div>').appendTo($gameContainer);
            self.$Hint = UI.createButton({
                title: 'Hint',
                'class': 'h5p-hangMan-hint',
                'text': 'Hint',
                click: function(event) {
                    $(this).attr("disabled", true);
                    var $hintWord = $('<div>' + hintChoosen + '</div>').css('color', 'white').appendTo($DivBottom);
                    // if (self.options.CategorySelectionList[categoryChoosen].CategoryWordList[0].HintImage && self.options.CategorySelectionList[categoryChoosen].CategoryWordList[0].HintImage.path) {
                    //   $gameContainer.append('<img class="hint-image "style="display:inline-block;" src="' + H5P.getPath(self.options.CategorySelectionList[0].CategoryWordList[0].HintImage.path, self.id) + '">');
                    // }
                }
            });
            $DivBottom.append(self.$Hint);
            self.$Retry = UI.createButton({
                title: 'Retry',
                'text': 'Retry',
                click: function(event) {
                    // StartGame($container,livesChoosen,categoryChoosen);
                    $container.empty();
                    guesses = [];
                    counter = 0;

                    HangMan.prototype.attach($container);
                }
            }).appendTo($DivBottom);
            $DivRight.append($DivBottom);
            $gameContainer.append($DivRight);
        }
    };


    HangMan.prototype.attach = function($container) {
        var i = 0;
        $container.addClass("h5p-hangman");
        $container.append('<h1>HANGMAN GAME</h1>');
        $container.append('<br/><br/>');
        var $optionContainer = $('<ul class="ul-select"/> <tr />').appendTo($container);
        var $chooseLevel = '<li><select id="select-lives" class="custom-select">' +
            '<option>Difficulty Levels:</option>' +
            '<option value="10" >10 Lives</option>' +
            '<option value="9" >9 Lives</option>' +
            '<option value="8" >8 Lives</option><option value="7" >7 Lives</option>' +
            '</select></li>';


        //$container.append(lives);
        $optionContainer.append($chooseLevel);
        // $container.append($optionContainer);

        var lives = document.getElementById('select-lives');
        $(lives).change(function() {
            livesChoosen = lives.value;
            console.log(livesChoosen);
        });

        var $Category = [];
        var $liContainer = $('<li/>');
        var $selectContainer = $('<select  id="select-category" placeholder="Choose Category" />');
        $selectContainer.append('<option>Choose Category:</option>');
        for (i = 0; i < self.options.CategorySelectionList.length; i++) {
            var $chooseCategory = '<option value="' + i + '">' +
                self.options.CategorySelectionList[i].CategoryText + '</option>';
            console.log(self.options.CategorySelectionList[i].CategoryText);
            $selectContainer.append($chooseCategory);
        }


        $liContainer.append($selectContainer);
        $optionContainer.append($liContainer);
        // $container.append($optionContainer);

        var category = document.getElementById('select-category');
        $(category).change(function() {
            categoryChoosen = category.value;
            console.log(categoryChoosen);
        });




        $container.append('<br/><br/><br/><br/><br/>');

        self.$Play = UI.createButton({
            title: 'Play',
            'class': 'h5p-hangMan-xPlay',
            'text': 'Play',
            click: function(event) {
                if ((livesChoosen === undefined) || (categoryChoosen === undefined)) {
                    alert("level or category not selected!!");
                } else {
                    StartGame($container, livesChoosen, categoryChoosen);
                    newAnimate(livesChoosen,$container);
                }


            }
        });
        $container.append(self.$Play);


        H5P.trigger('resize');
    }
    return HangMan;


})(H5P.jQuery, H5P.JoubelUI);
