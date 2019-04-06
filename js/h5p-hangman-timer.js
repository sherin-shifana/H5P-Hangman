(function (Hangman, Timer) {

  /**
   * Adapter between memory game and H5P.Timer
   *
   * @class H5P.Hangman.Timer
   * @extends H5P.Timer
   * @param {H5P.jQuery} element
   */
  Hangman.Timer = function (element) {

    /**
    * @alias H5P.Hangman.Timer#
    */
    const self = this;

    // Initialize event inheritance
    Timer.call(self, 100);

    /**
    * @private {string}
    */
    const naturalState = element.innerText;

    /**
     * Set up callback for time updates.
     * Formats time stamp for humans.
     * @private
     */
    const update = function () {
      const time = self.getTime();
      let hours = Timer.extractTimeElement(time, 'hours');
      let minutes = Timer.extractTimeElement(time, 'minutes');
      let seconds = Timer.extractTimeElement(time, 'seconds') % 60;

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
