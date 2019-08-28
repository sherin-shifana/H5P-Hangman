(function ($,Hangman) {

  /**
   *To draw Hangman according to the wrong attempts
   * @class H5P.Hangman.HangmanVector
   * @param {Number} numParts
   */
  Hangman.HangmanVector = function ( numParts) {
    this.numParts = parseInt(numParts);
    this.currentState = 10;
    this.canvasSize = 100;
  };

  /**
  * Append the canvas to the Hangman $container.
  * @param {H5P.jQuery} $container
  * @param {Number} cSize
  */
  Hangman.HangmanVector.prototype.appendTo = function ($container, cSize) {
    this.canvasSize = cSize;
    this.$canvas = $('<canvas id="canvas" height="'+cSize+'px" width="'+cSize+'px"></canvas>').appendTo($container);
    this.prepareCanvas();
    this.drawFirst();
  };

  /**
  * Draw the next part of Hangman to be drawn
  */
  Hangman.HangmanVector.prototype.drawNext = function () {
    this.draw();
    this.currentState--;
  };

  /**
  * Prepare the canvas for drawing Hangman by defining properties of canvas.
  */
  Hangman.HangmanVector.prototype.prepareCanvas = function () {
    this.canvas = this.$canvas[0];
    this.height = this.canvas.height;
    this.width = this.canvas.width;
    this.unitHt = this.height / 6;
    this.unitWt = this.width / 6;
    this.unit = 2;

    this.radius = this.canvasSize/15;
    this.standWidth = (this.canvasSize/25 < 10)?10: Math.floor(this.canvasSize/25);
    this.lineWidth = (this.canvasSize/50 < 5)?5: Math.floor(this.canvasSize/50);
    this.gap = (this.canvasSize/50 < 5)?5: Math.floor(this.canvasSize/50);
    this.pos = this.canvasSize - this.gap;
  };

  /**
  * Draw head of Hangman
  */
  Hangman.HangmanVector.prototype.drawHead = function () {
    const centerX= this.canvasSize*0.5;
    const centerY= (this.gap*7)+this.radius;
    const context = this.canvas.getContext("2d");
    context.beginPath();
    context.arc(centerX,centerY, this.radius, 0, 2 * Math.PI, false);
    context.lineWidth = this.gap;
    context.strokeStyle = '#0ebb7a';
    context.stroke();
  };

  /**
  * Draw parts of Hangman which are lines.
  * @param {Number} pathFromX
  * @param {Number} pathFromY
  * @param {Number} pathToX
  * @param {Number} pathToY
  * @param color
  * @param {Number} lineWidth
  */
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

  /**
  * Draw Hangman according to the current state
  */
  Hangman.HangmanVector.prototype.draw = function () {
    switch (this.currentState) {
      case 10:
      //frame1
        this.drawLine(this.gap, this.pos, this.pos , this.pos, "#ea622c", this.standWidth);
        break;

      case 9:
      // frame2
        this.drawLine(2*this.gap, this.gap, 2*this.gap, this.pos, "#ea622c", this.standWidth);
        break;

      case 8:
      //frame3
        this.drawLine(3*this.gap, 2*this.gap, this.canvasSize*0.75, 2*this.gap, "#ea622c", this.standWidth);
        break;

      case 7:
      //frame4
        this.drawLine(this.canvasSize*0.5, (this.gap*2)+(this.standWidth/2), this.canvasSize*0.5 ,this.gap*7, "#edb41e", this.standWidth*0.8);
        break;

      case 6:
      //head
        this.drawHead();
        break;
      case 5:
      // torso
        this.drawLine(this.canvasSize*0.5, (this.gap*7)+(2*this.radius), this.canvasSize*0.5, this.canvasSize*0.6, "#0ebb7a", this.lineWidth);
        break;
      case 4:
      //left arm
        this.drawLine(this.canvasSize*0.5, this.canvasSize*0.4, this.canvasSize*0.35, this.canvasSize*0.5, "#0ebb7a",this.lineWidth);
        break;
      case 3:
      // right arm
        this.drawLine(this.canvasSize*0.5, this.canvasSize*0.4, this.canvasSize*0.65, this.canvasSize*0.5, "#0ebb7a", this.lineWidth);
        break;
      case 2:
      // left leg
        this.drawLine(this.canvasSize*0.5, this.canvasSize*0.6, this.canvasSize*0.35, this.canvasSize*0.75, "#0ebb7a", this.lineWidth);
        break;
      case 1:
        this.drawLine(this.canvasSize*0.5, this.canvasSize*0.6, this.canvasSize*0.65, this.canvasSize*0.75, "#0ebb7a", this.lineWidth);
        break;
      //rightleg
    }
  };

  /**
  * If the selected level is less then 10, then draw initial parts
  */
  Hangman.HangmanVector.prototype.drawFirst = function () {
    this.currentState = 10;
    while (this.currentState > this.numParts) {
      this.drawNext();
    }
  };

  /**
  *
  */
  Hangman.HangmanVector.prototype.redraw = function (attemptsLeft) {
    while (this.currentState > attemptsLeft) {
      this.drawNext();
    }
  };

  return Hangman.HangmanVector;
})(H5P.jQuery,H5P.Hangman);
