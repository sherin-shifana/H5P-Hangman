H5P.HangMan=(function($,UI){
  var self = this;
  var livesChoosen;
  var alphabet = [];
  var i;
  var guesses = [];
  var categoryChoosen;
  function HangMan(options,id) {

    self.options = options;
    // Keep provided id.
    self.id = id;

      StartGame = function($container,livesChoosen,categoryChoosen){

        console.log(arguments[1]);
        var temp;
        temp = arguments[1].value;
        //console.log(temp);
        //value of livesChoosen passed to the function StartGame after clicking play button
        //var LiveDemo = this.innerHTML;

        $container.empty();

        var $DivTop = $('<div class="top-div"> </div>');
        StartTimer =function(){
            console.log("StartTimer");
            self.$status = $('<span>'+'<dl class="sequencing-status" style="display: inline-block;">' + '<dt>'  + '</dt>' + '<dd class="h5p-time-spent">00:00:00</dd>' +
            '<dt>' + '</dt>' + '</dl>'+'<span class = "top-div-left" id="lives-left"> Lives Left:'+livesChoosen+'</span>');
            self.$status.appendTo($container);
            self.timer = new HangMan.Timer(self.$status.find('.h5p-time-spent')[0]); //Initialize timer
              //after clicking play
            self.timer.play();
          }
      $container.append($DivTop);
      StartTimer();

    //  $DivTop.append('<span class = "top-div-left" style="padding-left:550px;"> Lives Left:</span>');
      var $gameContainer = $('<div class= "game-container">').appendTo($container);
      var $DivLeft = $('<div class="div-left"><p>Click the buttons below to guess the word</p> </div>').appendTo($gameContainer);
      var $blankSpace = $('<div></div>').appendTo($DivLeft);

      // console.log(categoryChoosen.CategoryWordList[0].hintText);
      var wordList=[];
      for(i=0;i<self.options.CategorySelectionList[categoryChoosen].CategoryWordList.length;i++){
      wordList.push( self.options.CategorySelectionList[categoryChoosen].CategoryWordList[i].EnterWord);
    }

    var word= wordList[Math.floor(Math.random()*wordList.length)];
    console.log(word);


            for(i=0;i<word.length;i++){

              var  guess = document.createElement('li');

              guess.setAttribute('class', 'guess');
              if (word[i] === " ") {
                  guess.innerHTML = " ";
                  space = 1;
                }
              else {
                  guess.innerHTML = "_";
                }
              // guess.innerHTML = "_";
              guesses.push(guess);

            }
            $blankSpace.append(guesses);

            var showLives=document.getElementById("lives-left");
            comments = function () {
             showLives.innerHTML = "Lives Left: " + livesChoosen ;
             if (livesChoosen < 1) {
               showLives.innerHTML = "Lives Left: " + 0 ;
             }
           }
           var animate = function () {
             var drawMe = livesChoosen ;
             drawArray[drawMe]();
           }

           canvas =  function(){

             myStickman = document.getElementById("div-right");
             context = myStickman.getContext('2d');
             context.beginPath();
             context.strokeStyle = "#fff";
             context.lineWidth = 2;
           };

             head = function(){
               myStickman = document.getElementById("div-right");
               context = myStickman.getContext('2d');
               context.beginPath();
               context.arc(60, 25, 10, 0, Math.PI*2, true);
               context.stroke();
             }

           draw = function($pathFromx, $pathFromy, $pathTox, $pathToy) {
             myStickman = document.getElementById("div-right");
             context = myStickman.getContext('2d');
             context.moveTo($pathFromx, $pathFromy);
             context.lineTo($pathTox, $pathToy);
             context.stroke();
         }

            frame1 = function() {
              draw (0, 150, 150, 150);
            };

            frame2 = function() {
              draw (10, 0, 10, 600);
            };

            frame3 = function() {
              draw (0, 5, 70, 5);
            };

            frame4 = function() {
              draw (60, 5, 60, 15);
            };

            torso = function() {
              draw (60, 36, 60, 70);
            };

            rightArm = function() {
              draw (60, 46, 100, 50);
            };

            leftArm = function() {
              draw (60, 46, 20, 50);
            };

            rightLeg = function() {
              draw (60, 70, 100, 100);
            };

            leftLeg = function() {
              draw (60, 70, 20, 100);
            };

           drawArray = [rightLeg, leftLeg, rightArm, leftArm,  torso,  head, frame4, frame3, frame2, frame1];




      alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h','i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's','t', 'u', 'v', 'w', 'x', 'y', 'z'];
      for ( i = 0; i < alphabet.length; i++) {

      var $letter = $('<button class="div-alpha">'+ alphabet[i] +'</button>').appendTo($DivLeft);

      $letter.click(function(){
            $(this).attr("disabled", true);
            var flag=0;
            for(i=0;i<word.length;i++){
                if(word[i]===this.innerHTML){
                  guesses[i].innerHTML=this.innerHTML;
                  flag=1;
                }

              }
              if(flag!==1){
                livesChoosen -= 1;

                      comments();
                      animate();
                      if(livesChoosen===0){
                        $container.empty();
                        var $failed = $("<p>0 Lives Left!!!</br>The Game Is Over :( </p>").appendTo($container);
                        gameOver();

                      }
              }

      });
          var gameOver=function(){
            self.$Retry = UI.createButton({
                               title: 'Retry',
                               'text':'Retry',
                              click:function(event){
                                    // StartGame($container,livesChoosen,categoryChoosen);
                                    $container.empty();
                                    HangMan.prototype.attach($container);

                                   }
                      });
                      $container.append(self.$Retry);
          }
      }


      $gameContainer.append($DivLeft);
      var $DivRight = $('<canvas id="div-right"></canvas>');
      $gameContainer.append($DivRight);
      var $DivBottom = $('<div class="div-bottom" style = "padding-top:25px;"> </div>').appendTo($gameContainer);
      self.$Hint = UI.createButton({
                         title: 'Hint',
                         'class': 'h5p-hangMan-hint',
                         'text':'Hint',
                        click:function(event){
                              $(this).attr("disabled", true);
                              var $hintWord = $('<div>'+self.options.CategorySelectionList[0].CategoryWordList[0].hintText+'</div>').appendTo($DivBottom);
                              if (self.options.CategorySelectionList[0].CategoryWordList[0].HintImage && self.options.CategorySelectionList[0].CategoryWordList[0].HintImage.path) {
                                $gameContainer.append('<img class="hint-image "style="display:inline-block;" src="' + H5P.getPath(self.options.CategorySelectionList[0].CategoryWordList[0].HintImage.path, self.id) + '">');
                              }
                             }
                });
      $DivBottom.append(self.$Hint);
    }
  };


HangMan.prototype.attach = function($container){
      var i=0;
      $container.append('<h1>HANGMAN GAME</h1>');
      var $optionContainer=$('<table /> <tr />');
      var $chooseLevel='<td style="padding-right:50px;"><select id="select-lives">'+
        '<option value="10">Difficulty Levels:</option>'+
        '<option value="10">10 Lives</option>'+
        '<option value="9">9 Lives</option>'+
        '<option value="8">8 Lives</option><option value="7">7 Lives</option>'+
        '</select></td>';


      //$container.append(lives);
      $optionContainer.append($chooseLevel);
      $container.append($optionContainer);

      var lives = document.getElementById('select-lives');
      $(lives).change(function(){
          livesChoosen = lives.value;
          console.log(livesChoosen);
        });
      var $Category=[];
      var $tdContainer = $('<td style="padding-right:500px; />');
      var $selectContainer = $('<select  id="select-category" />');
      $selectContainer.append('<option>Choose Category:</option>');
      for(i=0;i<self.options.CategorySelectionList.length;i++){
            var $chooseCategory='<option value="'+ i +'">'
                                +self.options.CategorySelectionList[i].CategoryText+'</option>';
                                console.log(self.options.CategorySelectionList[i].CategoryText);
            $selectContainer.append($chooseCategory);
             }


      $tdContainer.append($selectContainer);
      $optionContainer.append($selectContainer);
      $container.append($optionContainer);

      var category = document.getElementById('select-category');
      $(category).change(function(){
          categoryChoosen = category.value;

        });

      $container.append('<br/><br/><br/><br/><br/><br/><br/>');

      self.$Play = UI.createButton({
                         title: 'Play',
                         'class': 'h5p-hangMan-xPlay',
                         'text':'Play',
                        click:function(event){
                              StartGame($container,livesChoosen,categoryChoosen);

                             }
                });
                $container.append(self.$Play);


      H5P.trigger('resize');
}
return HangMan;


})(H5P.jQuery, H5P.JoubelUI);
