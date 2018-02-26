H5P.HangMan=(function($,UI){
  var self = this;
  var livesChoosen;
  var alphabet = [];
  var i;
  var guesses = [];
  function HangMan(options,id) {

    self.options = options;
    // Keep provided id.
    self.id = id;

      StartGame = function($container,livesChoosen){
        console.log(livesChoosen);//value of livesChoosen passed to the function StartGame after clicking play button
        console.log("working2");
      $container.empty();

        var $DivTop = $('<div class="top-div"> </div>');
        StartTimer =function(){
            console.log("StartTimer");
            self.$status =  $('<span>'+'<dl class="sequencing-status" style="display: inline-block;">' + '<dt>'  + '</dt>' + '<dd class="h5p-time-spent">00:00:00</dd>' +
            '<dt>' + '</dt>' + '</dl>'+'<span class = "top-div-left"> Lives Left:</span>'+'</span>');
            self.$status.appendTo($container);
            self.timer = new HangMan.Timer(self.$status.find('.h5p-time-spent')[0]); //Initialize timer
              //after clicking play
            self.timer.play();
          }
      $container.append($DivTop);
      StartTimer();
    //  $DivTop.append('<span class = "top-div-left" style="padding-left:550px;"> Lives Left:</span>');
    var $gameContainer = $('<div class= "game-container">').appendTo($container);
      var $DivLeft = $('<div class="div-left"><p>Free software or libre software[1][2] is computer software distributed under terms that allow users to run the software for any purpose as well as to study, change, and distribute it and any adapted versions.</p> </div>');


            var $blankSpace = $('<div></div>').appendTo($DivLeft);
            console.log(self.options.CategorySelectionList[0].WordHintGroup.EnterWord);
            var word = self.options.CategorySelectionList[0].WordHintGroup.EnterWord;
            for(i=0;i<word.length;i++){
              var  guess = document.createElement('li');
              guess.setAttribute('class', 'guess');
              if (word[i] === " ") {
                  guess.innerHTML = " ";
                  space = 1;
                } else {
                  guess.innerHTML = "_";
                }
              // guess.innerHTML = "_";
              guesses.push(guess);

            }
            $blankSpace.append(guesses);



             alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h','i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's','t', 'u', 'v', 'w', 'x', 'y', 'z'];
             for ( i = 0; i < alphabet.length; i++) {

             var $letter = $('<button class="div-alpha">'+ alphabet[i] +'</button>').appendTo($DivLeft);
             var demo = alphabet[i];
             $letter.click(function(){

                $(this).attr("disabled", true);
                console.log(demo);
              });

            }
      $gameContainer.append($DivLeft);
      var $DivRight = $('<div class="div-right" style= "border: solid 1px red;height:300px;width:20%;"> </div>');
      $gameContainer.append($DivRight);



    }
  };


HangMan.prototype.attach = function($container){
      var i=0;
      $container.append('<h1>HANGMAN GAME</h1>');
      var $optionContainer=$('<table /> <tr />');
      var $chooseLevel='<td style="padding-right:50px;"><select id="select-lives">'+
        '<option value="10">Difficulty Levels:</option>'+
        '<option value="10">10 Lives</option>'+
        '<option value="8">8 Lives</option>'+
        '<option value="5">5 Lives</option><option value="4">4 Lives</option>'+
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
      var $selectContainer = $('<select  />');
      $selectContainer.append('<option>Choose Category:</option>');
      for(i=0;i<self.options.CategorySelectionList.length;i++){
            var $chooseCategory='<option value="'+ self.options.CategorySelectionList[i].CategoryText +'">'
                                +self.options.CategorySelectionList[i].CategoryText+'</option>';
            $selectContainer.append($chooseCategory);
             }
      $tdContainer.append($selectContainer);
      $optionContainer.append($selectContainer);
      $container.append($optionContainer);
      $container.append('<br/><br/><br/><br/><br/><br/><br/>');

      self.$Play = UI.createButton({
                         title: 'Play',
                         'class': 'h5p-hangMan-xPlay',
                         'text':'Play',
                        click:function(event){
                              StartGame($container,livesChoosen);
                              // self.timer.play();
                              //StartTimer();
                              //  GameStart();
                             }
                });

                $container.append(self.$Play);

                // var lives = document.getElementById('select-lives');
                // $(lives).change(function(){
                //          livesNum=lives.value;
                //          console.log(livesNum);
                //       });

      //console.log(self.options.CategorySelectionList[1].CategoryText);
      console.log(self.options.CategorySelectionList.length);
      console.log(self.options.CategorySelectionList[0].CategoryText);
      H5P.trigger('resize');
}
return HangMan;


})(H5P.jQuery, H5P.JoubelUI);
