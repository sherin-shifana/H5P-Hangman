(function (Hangman, Timer) {

  /**
   * Adapter between memory game and H5P.Timer
   *
   * @class H5P.Hangman.Timer
   * @extends H5P.Timer
   * @param {Element} element
   */
  Hangman.Timer = function (element) {
    /** @alias H5P.Hangman.Timer# */
    var self = this;

    // Initialize event inheritance
    Timer.call(self, 100);

    /** @private {string} */
    var naturalState = element.innerText;

    /**
     * Set up callback for time updates.
     * Formats time stamp for humans.
     *
     * @private
     */
    var update = function () {
      var time = self.getTime();
      var hours = Timer.extractTimeElement(time, 'hours');
      var minutes = Timer.extractTimeElement(time, 'minutes');
      var seconds = Timer.extractTimeElement(time, 'seconds') % 60;

      // Update duration attribute
      element.setAttribute('datetime', 'PT' + hours + 'H' + minutes + 'M' + seconds + 'S');

      // Add leading zero
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (hours < 10) {
        hours = '0' + hours;
      }

      element.innerText = hours + ':' + minutes + ':' + seconds;
    };

    // Setup default behavior
    self.notify('every_tenth_second', update);
    self.on('reset', function () {
      element.innerText = naturalState;
      self.notify('every_tenth_second', update);
    });
    self.notify('every_tenth_minutes', update);
    self.on('reset', function () {
      element.innerText = naturalState;
      self.notify('every_tenth_minutes', update);
    });
  };

  // Inheritance
  Hangman.Timer.prototype = Object.create(Timer.prototype);
  Hangman.Timer.prototype.constructor = Hangman.Timer;

})(H5P.Hangman, H5P.Timer);
