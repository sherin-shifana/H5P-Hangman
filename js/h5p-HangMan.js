H5P.HangMan=(function($){
  var self=this;
  function HangMan(params,id){
          self.params = params;
          self.id = id;
  };
HangMan.prototype.attach = function($container){
$container.addClass('H5P.HangMan');
$container.append('<div class="hint-text">' + self.params.hint+ '</div>');

      //  H5P.trigger('resize');
  }
  return HangMan;
})(H5P.jQuery);
