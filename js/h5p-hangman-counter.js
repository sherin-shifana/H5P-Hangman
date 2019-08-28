(function (Hangman) {

  /**
  * Keeps track of the number of times the game is submitted
  *
  * @class H5P.Hangman.Counter
  * @param {H5P.jQuery} $container
  */
  Hangman.Counter = function ($container) {

    /**
    * @alias H5P.Hangman.Counter#
    */
    const that = this;
    let current = parseInt($container.text());

    /**
    * @private
    */
    const update = function () {
      $container[0].innerText = current;
    };

    /**
    * Increment the counter.
    */
    that.increment = function () {
      current++;
      update();
    };

    /**
    * Decrement the counter.
    */
    that.decrement = function () {
      if (current > 0) {
        current--;
      }
      update();
    };

    /**
    * Revert counter back to its natural state
    */
    that.reset = function () {
      current = 0;
      update();
    };
  };
})(H5P.Hangman);
