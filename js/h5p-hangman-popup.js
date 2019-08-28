(function (Hangman, $) {

  /**
   * A dialog for reading the hintription of a card.
   *
   * @class H5P.Hangman.Popup
   * @param {H5P.jQuery} $container
   */
  Hangman.Popup = function ($container) {

    /**
    * @alias H5P.Hangman.Popup#
    */
    const that = this;
    let closed;
    const $popup = $('<div class="h5p-hangman-pop" role="dialog"><div class="h5p-hangman-top"></div><div class="h5p-hangman-hint h5p-programatically-focusable" tabindex="-1"></div><div class="h5p-hangman-close" role="button" tabindex="0">x</div></div>').appendTo($container);
    const $hint = $popup.find('.h5p-hangman-hint');

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
     * @param {string} hint
     */
    that.show = function (hint) {
      $hint.html(hint);
      $popup.show();
      $hint.focus();
      closed = 'hint';
    };

    /**
     * Close the popup.
     * @param {boolean} refocus Sets focus after closing the dialog
     */
    that.close = function () {
      if (closed !== undefined) {
        $popup.hide();
        closed = undefined;
      }
    };
  };

})(H5P.Hangman, H5P.jQuery);
