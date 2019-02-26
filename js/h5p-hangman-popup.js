(function (Hangman, $) {

  /**
   * A dialog for reading the hintription of a card.
   *
   * @class H5P.Hangman.Popup
   * @param {H5P.jQuery} $container
   * @param {Object.<string, string>} l10n
   */
  Hangman.Popup = function ($container) {
    /** @alias H5P.Hangman.Popup# */
    let that = this;

    let closed;

    let $popup = $('<div class="h5p-hangman-pop" role="dialog"><div class="h5p-hangman-top"></div><div class="h5p-hangman-hint h5p-programatically-focusable" tabindex="-1"></div><div class="h5p-hangman-close" role="button" tabindex="0">x</div></div>').appendTo($container);
    let $hint = $popup.find('.h5p-hangman-hint');
    // let $top = $popup.find('.h5p-hangman-top');

    // Hook up the close button
    $popup.find('.h5p-hangman-close').on('click', function () {
      that.close(true);
    }).on('keypress', function (event) {
      if (event.which === 13 || event.which === 32) {
        that.close(true);
        event.preventDefault();
      }
    });

    /**
     * Show the popup.
     *
     * @param {string} hint
     * @param {H5P.jQuery[]} imgs
     * @param {function} done
     */
    that.show = function (hint) {
      $hint.html(hint);
      $popup.show();
      $hint.focus();
      closed = 'hint';
    };

    /**
     * Close the popup.
     *
     * @param {boolean} refocus Sets focus after closing the dialog
     */
    that.close = function (refocus) {
      if (closed !== undefined) {
        $popup.hide();
        closed(refocus);
        closed = undefined;
      }
    };

    /**
     * Sets popup size relative to the card size
     *
     * @param {number} fontSize
     */
    that.setSize = function () {
      // // Set image size
      // $top[0].style.fontSize = fontSize + 'px';
      //
      // // Determine card size
      // let cardSize = fontSize * 6.25; // From CSS

      // Set popup size
      $popup[0].style.minWidth = (10) + 'em';
      $popup[0].style.minHeight = 10 + 'em';
    };
  };

})(H5P.Hangman, H5P.jQuery);
