(function (Hangman) {

  /**
  * Keeps track of the number of times the game is submitted
  *
  * @class H5P.Hangman.Counter
  * @param {H5P.jQuery} $container
  */
  Hangman.Counter = function ($container) {
    /** @alias H5P.Hangman.Counter# */

    var self = this;
    var current = parseInt($container.text());


    /**
    * @private
    */
    var update = function () {
      $container[0].innerText = current;
    };
    /**
    * Increment the counter.
    */
    self.increment = function () {
      current++;
      update();
    };

    self.decrement = function () {
      current--;
      update();
    }
    /**
    * Revert counter back to its natural state
    */
    self.reset = function () {
      current = 0;
      update();
    };
  };
})(H5P.Hangman);
