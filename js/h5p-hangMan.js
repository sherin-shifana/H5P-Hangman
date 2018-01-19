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
        //  click:function(event){
        //    this.hide();
         //}
});
$container.append(this.$Play);
  $container.append('<div class="HintText">' + this.options.hintText + '</div>');
console.log(this.options.hang[0].EnterWord);
H5P.trigger('resize');
}
return HangMan;


})(H5P.jQuery, H5P.JoubelUI);
