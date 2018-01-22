H5P.HangMan=(function($,UI){
  function HangMan(options,id) {
    this.options = options;
    // Keep provided id.
    this.id = id;
  };
HangMan.prototype.attach = function($container){
$container.addClass('H5P.HangMan');

this.$Play = UI.createButton({
         title: 'Play',
         'class': 'h5p-hangMan-Play',
         'text':'Play',
        click:function(event){
              //  $container.empty();
                }
});
$container.append('<table><tr><td style="padding-right:50px;"><select><option value="10">Difficulty Levels:</option><option value="10">10 Lives</option><option value="8">8 Lives</option><option value="5">5 Lives</option><option value="4">4 Lives</option></select></td><td><select><option value="Cities">Choose Category:</option><option value="Cities">Cities</option><option value="Mountains">Mountains</option><option value="Rivers">Rivers</option><option value="Trees">Trees</option><option value="Animals">Animals</option></select></td></tr></table>').css("padding","200px");
//$container.append('<li  style="padding-right:50px;"><select><option value="10">Difficulty Levels:</option><option value="10">10 Lives</option></select></li>');
  //var category=document.getElehmentById('selectCategory');
  var selectCategory=this.options.CategorySelectionList[1].CategoryText;
$container.append('<br/><br/><br/><br/><br/><br/><br/>');
$container.append(this.$Play);
console.log(this.options.CategorySelectionList[1].CategoryText);
H5P.trigger('resize');
}
return HangMan;


})(H5P.jQuery, H5P.JoubelUI);
