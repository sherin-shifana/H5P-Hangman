(function($,Hangman) {

  Hangman.HangmanVector = function ( numParts) {

    this.numParts = numParts;
    this.currentState = 10;
    // this.totalParts = 10;
  }

  Hangman.HangmanVector.prototype.appendTo = function ($container) {
    this.$canvas = $('<canvas class="canvas"></canvas>').appendTo($container);
    this.drawFirst();
  };

  Hangman.HangmanVector.prototype.drawNext = function () {
    this.draw();
    this.currentState--;
  };

  Hangman.HangmanVector.prototype.draw = function () {

    switch (this.currentState) {

      case 10:
      //frame1
        line(unitHt - unitWt, height - 5, width, height - 5, "#ea622c", 10);
        break;
      case 9:
      case 8:
      case 7:
      case 6:
      case 5:
      case 4:
      case 3:
      case 2:
      case 1:
      //rightleg


    }

  };

  Hangman.HangmanVector.prototype.drawFirst = function () {
    while (this.currentState > this.numParts) {
      this.drawNext();
    }
  };
  return Hangman.HangmanVector;
})(H5P.jQuery,H5P.Hangman);
