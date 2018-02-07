H5P.HangMan=(function($,UI){
  function HangMan(options,id) {
    this.options = options;
    // Keep provided id.
    this.id = id;
  };
HangMan.prototype.attach = function($container){
//$container.addClass('H5P.HangMan');
this.$status =  $('<dl class="sequencing-status">' + '<dt>'  + '</dt>' + '<dd class="h5p-time-spent">0:00</dd>' +
'<dt>' + '</dt>' + '</dl>');
this.$status.appendTo($container);
      self.timer = new HangMan.Timer(this.$status.find('.h5p-time-spent')[0]); //Initialize timer
      this.$Play = UI.createButton({
               title: 'Play',
               'class': 'h5p-hangMan-xPlay',
               'text':'Play',
              click:function(event){
                    // $container.empty();
                     self.timer.play();
                     //GameStart();
                   }
      });
      var i=0;
      $container.append('<h1>HANGMAN GAME</h1>');
      var $optionContainer=$('<table /> <tr />');
      var $chooseLevel='<td style="padding-right:50px;"><select>'+
        '<option value="10">Difficulty Levels:</option>'+
        '<option value="10">10 Lives</option>'+
        '<option value="8">8 Lives</option>'+
        '<option value="5">5 Lives</option><option value="4">4 Lives</option>'+
        '</select></td>';
      $optionContainer.append($chooseLevel);
      $container.append($optionContainer);
      var $Category=[];
      var $tdContainer = $('<td style="padding-right:500px; />');
      var $selectContainer = $('<select  />');
      $selectContainer.append('<option>Choose Category:</option>');
      for(i=0;i<this.options.CategorySelectionList.length;i++)
          {
            var $chooseCategory='<option value="'+ this.options.CategorySelectionList[i].CategoryText +'">'+this.options.CategorySelectionList[i].CategoryText+'</option>';
         //$Category.push($chooseCategory);
            console.log($chooseCategory);
      $selectContainer.append($chooseCategory);
       }
                $tdContainer.append($selectContainer);
                $optionContainer.append($selectContainer);
                $container.append($optionContainer);
                $container.append('<br/><br/><br/><br/><br/><br/><br/>');
                $container.append(this.$Play);

      //console.log(this.options.CategorySelectionList[1].CategoryText);
      console.log(this.options.CategorySelectionList.length);
      console.log(this.options.CategorySelectionList[0].CategoryText);
      // GamaStart()=function(){
      //   //function to start game
      // }
      H5P.trigger('resize');
}
return HangMan;


})(H5P.jQuery, H5P.JoubelUI);
