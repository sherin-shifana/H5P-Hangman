(function ($,Hangman) {

  Hangman.HangmanVector = function ( numParts) {

    this.numParts = numParts;
    this.currentState = 10;
    // this.totalParts = 10;
  };

  Hangman.HangmanVector.prototype.appendTo = function ($container) {
    this.$canvas = $('<canvas id="canvas"></canvas>').appendTo($container);
    this.prepareCanvas();
    this.drawFirst();
  };

  Hangman.HangmanVector.prototype.drawNext = function () {

    this.draw();
    this.currentState--;
  };

  Hangman.HangmanVector.prototype.prepareCanvas = function () {
    this.canvas = this.$canvas[0];
    this.canvas.height = this.canvas.width;
    this.height = this.canvas.height;
    this.width = this.canvas.width;
    this.unitHt = this.height / 6;
    this.unitWt = this.width / 6;
    this.unit = 2;
    this.centerX = this.width / 1.7;
    this.centerY = this.height / 5.8;
    this.radius = 25;
  };

  Hangman.HangmanVector.prototype.drawHead = function () {
    const context = this.canvas.getContext("2d");
    context.beginPath();
    context.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI, false);
    context.lineWidth = 5;
    context.strokeStyle = '#0ebb7a';
    context.stroke();
  };

  Hangman.HangmanVector.prototype.drawLine = function (pathFromX, pathFromY, pathToX, pathToY, color, lineWidth) {
    const context = this.canvas.getContext('2d');
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(pathFromX, pathFromY);
    context.lineTo(pathToX, pathToY);
    context.stroke();
    context.closePath();
  };
  Hangman.HangmanVector.prototype.draw = function () {

    switch (this.currentState) {

      case 10:
      //frame1
        this.drawLine(this.unitHt - this.unitWt, this.height - 5, this.width, this.height - 5, "#ea622c", 10);
        break;

      case 9:
      // frame2
        this.drawLine(this.unitWt, this.height - 2, this.unitWt, this.unitHt - this.unitWt, "#ea622c", 10);
        break;

      case 8:
      //frame3
        this.drawLine(this.unitWt, this.unitHt - this.unitWt + 2 * this.unit, 4.5 * this.unitWt, this.unitHt - this.unitWt + 2 * this.unit, "#ea622c", 10);
        break;

      case 7:
      //frame4
        this.drawLine(3.5 * this.unitWt, this.unitHt - this.unitWt + this.unit * 4, 3.5 * this.unitWt, this.unitHt / 2, "#edb41e", 5);
        break;

      case 6:
      //head
        this.drawHead();
        break;
      case 5:
      // torso
        this.drawLine(3.5 * this.unitWt, this.unitHt / 2.2 + 2 * this.radius + 2.5 * this.unit, 3.5 * this.unitWt, this.unitHt * 3.3, "#0ebb7a", 5);
        break;
      case 4:
      //left arm
        this.drawLine(3.5 * this.unitWt, this.unitHt * 2.2, 4.5 * this.unitWt, this.unitHt * 2.7, "#0ebb7a", 5);
        break;
      case 3:
      // right arm
        this.drawLine(3.5 * this.unitWt, this.unitHt * 2.2, 2.5 * this.unitWt, this.unitHt * 2.7, "#0ebb7a", 5);
        break;
      case 2:
      // left leg
        this.drawLine(3.5 * this.unitWt, this.unitHt * 3.3, 4.5 * this.unitWt, this.unitHt * 4.3, "#0ebb7a", 5);
        break;
      case 1:
        this.drawLine(3.5 * this.unitWt, this.unitHt * 3.3, 2.5 * this.unitWt, this.unitHt * 4.3, "#0ebb7a", 5);
        break;
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
