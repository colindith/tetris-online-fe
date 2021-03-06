// Frank Poth 03/09/2018

/* The keyDownUp handler was moved to the main file. */

const Controller = function() {

  this.left  = new Controller.ButtonInput();
  this.right = new Controller.ButtonInput();
  this.up    = new Controller.ButtonInput();
  this.down  = new Controller.ButtonInput();
  this.space = new Controller.ButtonInput();
  this.z     = new Controller.ButtonInput();
  this.shift = new Controller.ButtonInput();
  this.enter = new Controller.ButtonInput();

  this.keyDownUp = function(type, key_code) {

    var isKeydown = (type == "keydown");
    switch(key_code) {

      case 37: this.left.getInput(isKeydown);   break;
      case 38: this.up.getInput(isKeydown);     break;
      case 39: this.right.getInput(isKeydown);  break;
      case 40: this.down.getInput(isKeydown);   break;
      case 32: this.space.getInput(isKeydown);  break;
      case 90: this.z.getInput(isKeydown);      break;
      case 16: this.shift.getInput(isKeydown);  break;
      case 13: this.enter.getInput(isKeydown);

    }

  };

  this.mouseClick = function(type, clientX, clientY, game) {
    game.mouseClick(clientX, clientY);
  }

  this.autoRepeat = function(buttonInput, action, box, autoRepeatDelay, autoRepeatInterval) {
    if (buttonInput.active && (buttonInput.delayCount == 0))  {
      action.call(box);
      if (buttonInput.inAutoShift){
        buttonInput.delayCount = autoRepeatInterval
      } else {
        buttonInput.inAutoShift = true
        buttonInput.delayCount = autoRepeatDelay
      }
    }
    if (!buttonInput.active) {
      buttonInput.delayCount = 0
      buttonInput.inAutoShift = false
    }
    if (buttonInput.delayCount > 0 ){
      buttonInput.delayCount -= 1
    }
  };

};

Controller.prototype = {

  constructor : Controller

};

Controller.ButtonInput = function() {

  this.active = false;
  this.down = false;
  this.delayCount = 0;
  this.inAutoShift = false;

};

Controller.ButtonInput.prototype = {

  constructor: Controller.ButtonInput,
  
  getInput: function(isKeydown) {
    if (this.down != isKeydown) this.active = isKeydown;
    this.down = isKeydown;
  }

};
