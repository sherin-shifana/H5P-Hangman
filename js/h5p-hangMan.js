H5P.HangMan=(function($,UI){
  var self = this;
var livesChoosen;
  function HangMan(options,id) {

    self.options = options;
    // Keep provided id.
    self.id = id;

      StartGame = function($container,livesChoosen){
    console.log(livesChoosen);
      console.log("working2");
      $container.empty();
          var $DivTop = $('<div class="top-div"> </div>');
          StartTimer =function(){
            console.log("StartTimer");
            self.$status =  $('<dl class="sequencing-status">' + '<dt>'  + '</dt>' + '<dd class="h5p-time-spent">0:00</dd>' +
            '<dt>' + '</dt>' + '</dl>');
            self.$status.appendTo($container);
            self.timer = new HangMan.Timer(self.$status.find('.h5p-time-spent')[0]); //Initialize timer
              //after clicking play
            self.timer.play();
          }
        $container.append($DivTop);
      StartTimer();
    }

    // changeLevels =function(livesChoosen){
    //   console.log("work");
    // }
  };
HangMan.prototype.attach = function($container){
      self.$Play = UI.createButton({
               title: 'Play',
               'class': 'h5p-hangMan-xPlay',
               'text':'Play',
              click:function(event){
                    // $container.empty();
                    StartGame($container,livesChoosen);
                    // self.timer.play();
                    //StartTimer();
                    //  GameStart();
                   }
      });
      var i=0;
      $container.append('<h1>HANGMAN GAME</h1>');
      var $optionContainer=$('<table /> <tr />');
      var $chooseLevel='<td style="padding-right:50px;"><select id="select-lives">'+
        '<option value="10">Difficulty Levels:</option>'+
        '<option value="10">10 Lives</option>'+
        '<option value="8">8 Lives</option>'+
        '<option value="5">5 Lives</option><option value="4">4 Lives</option>'+
        '</select></td>';

        var lives = document.getElementById('select-lives');
        $(lives).change(function(){
              var  livesChoosen=lives.value;
                 console.log(livesChoosen);
                 //changeLevels(livesChoosen);
              });

      $optionContainer.append($chooseLevel);
      $container.append($optionContainer);


      var $Category=[];
      var $tdContainer = $('<td style="padding-right:500px; />');
      var $selectContainer = $('<select  />');
      $selectContainer.append('<option>Choose Category:</option>');
      for(i=0;i<self.options.CategorySelectionList.length;i++)
          {
            var $chooseCategory='<option value="'+ self.options.CategorySelectionList[i].CategoryText +'">'
                                +self.options.CategorySelectionList[i].CategoryText+'</option>';
      $selectContainer.append($chooseCategory);
       }
                $tdContainer.append($selectContainer);
                $optionContainer.append($selectContainer);
                $container.append($optionContainer);
                $container.append('<br/><br/><br/><br/><br/><br/><br/>');
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
