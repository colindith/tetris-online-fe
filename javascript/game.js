
const Game = function() {

  this.world = {

    blockStacked: [
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0]
    ],

    settings: {
      initPos: [3, 2],
      autoDropInterval: 7,
      // delayedAutoShift: 30,
      autoRepeatDelay: 15,
      autoRepeatInterval: 5,
      lockDelay: 10,
      blockFieldWidth: 10,
      blockFieldHeight: 22,
  
    },
    

    background_color:"rgba(40,48,56,0.25)",

    friction:0.9,
    gravity:3,

    // player:new Game.Player(),
    previewQueue:new Game.PreviewQueue(),

    height:72,
    width:128,

    delayedCount: 0,
    
    autoShiftDelayCount: 0,
    autoShiftIntervalCount: 0,
    rotateIntervalCount: 0,
    softDropIntervalCount: 0,

    currentTetromino: null,    // This value would be null when in spawn delay

    stage: 0,    // 0: for begining & init a new tetromino
                 // 1: normal drop 
                 // 2: tetromino has attached to the stack, in lock delay
                 // 3: clear delay
                 // 4: spawn delay
                 // Note that for 1,2 currentTetromino should not be null, 
                 // thus the tetromino can be control by key board
                 // the stage idea is not good

    ///////////////// KEYBOARD EVENTS ////////////////////
    /* TODO: Check if move thes event handlers to a single sub class */
    controlLeft: function(){
      // TODO: Here should get the real left/right edge
      if (this.currentTetromino.leftmost() == 0) {
        return
      }
      if (this.isCollide(this.currentTetromino, [-1, 0])) {
        return
      }
      this.currentTetromino.pos[0] -= 1
    },
    controlRight: function(){
      if (this.currentTetromino.rightmost() == this.settings.blockFieldWidth-1) {
        return
      }
      if (this.isCollide(this.currentTetromino, [1, 0])) {
        return
      }
      this.currentTetromino.pos[0] += 1
    },
    controlRotateRight: function(){
      if (this.currentTetromino.rightmost(1) > this.settings.blockFieldWidth) {
        return
      };
      if (this.currentTetromino.leftmost(1) < 0) {
        return
      }
      if (this.isCollide(this.currentTetromino, [0, 0], 1)) {
        return
      }
      this.currentTetromino.rotateRight()
    },
    controlRotateLeft: function(){
      if (this.currentTetromino.rightmost(-1) > this.settings.blockFieldWidth) {
        return
      }
      if (this.currentTetromino.leftmost(-1) < 0) {
        return
      }
      if (this.isCollide(this.currentTetromino, [0, 0], -1)) {
        return
      }
      this.currentTetromino.rotateLeft()
    },

    //////////////// ROUTINE ///////////////////////
    drop: function(tetromino) {
      if (this.isCollide(tetromino, [0, 1]))  {
        this.attachTetromino()
      } else {
        tetromino.pos[1] += 1
      }
      
    },
    isCollide: function(tetromino, move, rotate=0) {
      if (tetromino.downmost() == this.blockStacked.length-1) {
        return true
      }

      blocks = this.currentTetromino.getBlocks(rotate)
      for (i=0; i<blocks.length; i++) {
        if (this.blockStacked[blocks[i][1]+move[1]][blocks[i][0]+move[0]] != 0) {
          return true
        }
      }
      return false
    },
    attachTetromino: function() {
      this.stage = 2
      this.delayedCount = 0

      blocks = this.currentTetromino.getBlocks()
      for (i=0; i<blocks.length; i++) {
        this.blockStacked[blocks[i][1]][blocks[i][0]] = this.currentTetromino.id
      }


    },
    initTetromino: function(position) {
      currentTetrominoId = this.previewQueue.pop()
      this.currentTetromino = new Game.Tetromino(currentTetrominoId, position)
      if (this.isCollide(this.currentTetromino, [0, 0])) {
        this.stage = 5
        this.delayedCount = 0
      } else {
        this.stage = 1
        this.delayedCount = 0
      }

    },
    update: function() {

      if (this.stage == 0) {
        this.initTetromino(this.settings.initPos)
      } 
      else if (this.stage == 1){
        if (this.delayedCount > this.settings.autoDropInterval){
          this.delayedCount = 0
          /* update keyboard event */
        
        
        
          /* update auto drop */
          this.drop(this.currentTetromino)
        }
        this.delayedCount++

      } else if (this.stage == 2){
        if (this.delayedCount > this.settings.lockDelay){
          this.stage = 0
          this.delayedCount = 0
        } else {
          this.delayedCount++
        }
      } else if (this.stage == 5){
        console.log("Good Game!")
      }

      if (this.autoShiftDelayCount > 0) {this.autoShiftDelayCount -= 1}
      if (this.autoShiftIntervalCount > 0) {this.autoShiftIntervalCount -= 1}
      if (this.rotateIntervalCount > 0) {this.rotateIntervalCount -= 1}
      if (this.softDropIntervalCount > 0) {this.softDropIntervalCount -= 1}
    }

  };

  this.update = function() {

    this.world.update();
      
  };

};

Game.prototype = { constructor : Game };


Game.PreviewQueue = function() {
	var items = [];
	this.pushNewTetrominos = function() {
    // TODO: implement this method
    items.push(1,2,3,4,5,6,7);
	};
	this.pop = function() {
    if (items.length < 7) {
      this.pushNewTetrominos()
    }
    return items.shift();
  };
  this.preview = function() {
    return items
  };
}

Game.rotatePositionTable = {
  1: [                            // I
    [[0,1],[1,1],[2,1],[3,1]],
    [[2,0],[2,1],[2,2],[2,3]],
    [[0,2],[1,2],[2,2],[3,2]],
    [[1,0],[1,1],[1,2],[1,3]],
  ],
  2: [                            // O
    [[1,0],[1,1],[2,0],[2,1]],
    [[1,0],[1,1],[2,0],[2,1]],
    [[1,0],[1,1],[2,0],[2,1]],
    [[1,0],[1,1],[2,0],[2,1]],
  ],
  3: [                            // T
    [[0,1],[1,0],[1,1],[2,1]],
    [[1,0],[1,1],[1,2],[2,1]],
    [[0,1],[1,1],[1,2],[2,1]],
    [[0,1],[1,0],[1,1],[1,2]],
  ],
  4: [                            // J
    [[0,1],[1,1],[2,0],[2,1]],
    [[1,0],[1,1],[1,2],[2,2]],
    [[0,1],[0,2],[1,1],[2,1]],
    [[0,0],[1,0],[1,1],[1,2]],
  ],
  5: [                            // L
    [[0,0],[0,1],[1,1],[2,1]],
    [[1,0],[1,1],[1,2],[2,0]],
    [[0,1],[1,1],[2,1],[2,2]],
    [[0,2],[1,0],[1,1],[1,2]],
  ],
  6: [                            // S
    [[0,1],[1,0],[1,1],[2,0]],
    [[1,0],[1,1],[2,1],[2,2]],
    [[0,2],[1,1],[1,2],[2,1]],
    [[0,0],[0,1],[1,1],[1,2]],
  ],
  7: [                            // Z
    [[0,0],[1,0],[1,1],[2,1]],
    [[1,1],[1,2],[2,0],[2,1]],
    [[0,1],[1,1],[1,2],[2,2]],
    [[0,1],[0,2],[1,0],[1,1]],
  ]
}

Game.collideEdgeTable = {
  1: [
    [1, 1, 0, 3],
    [0, 3, 2, 2],
    [2, 2, 0, 3],
    [0, 3, 1, 1],
  ],
  2: [
    [0, 1, 1, 2],
    [0, 1, 1, 2],
    [0, 1, 1, 2],
    [0, 1, 1, 2],
  ],
  3: [
    [0, 1, 0, 2],
    [0, 2, 1, 2],
    [1, 2, 0, 2],
    [0, 2, 0, 1],
  ],
  4: [
    [0, 1, 0, 2],
    [0, 2, 1, 2],
    [1, 2, 0, 2],
    [0, 2, 0, 1],
  ],
  5: [
    [0, 1, 0, 2],
    [0, 2, 1, 2],
    [1, 2, 0, 2],
    [0, 2, 0, 1],
  ],
  6: [
    [0, 1, 0, 2],
    [0, 2, 1, 2],
    [1, 2, 0, 2],
    [0, 2, 0, 1],
  ],
  7: [
    [0, 1, 0, 2],
    [0, 2, 1, 2],
    [1, 2, 0, 2],
    [0, 2, 0, 1],
  ],
}

Game.kickTable = {

}

Game.colorTable = {
  1: "#66ffff",     // I
  2: "#ffff00",     // O
  3: "#ff00ff",     // T
  4: "#ff9900",     // J
  5: "#0000ff",     // L
  6: "#ff3300",     // S
  7: "#66ff33"      // Z
}

Game.Tetromino = function(teriminoId, position){
  this.id = teriminoId

  this.rotatePosition = Game.rotatePositionTable[teriminoId]
  this.collideEdge = Game.collideEdgeTable[teriminoId]
  this.color = Game.colorTable[teriminoId]
  this.pos = [...position]
  
  this.direction = 0

}

Game.Tetromino.prototype = {
  constructor : Game.Tetromino,
  getBlocks: function(rotate=0) {
    var res = [];
    pos_x = this.pos[0];
    pos_y = this.pos[1];
    for (i=0; i<4; i++) {
      relPos = this.rotatePosition[(this.direction+rotate)%4][i]
      
      res.push([pos_x+relPos[0], pos_y+relPos[1]])
    }
    return res;
  },
  getColor: function() {
    return  this.color
  },
  downmost: function(rotate=0) {
    return this.pos[1] + this.collideEdge[(this.direction+rotate)%4][1]
  },
  leftmost: function(rotate=0) {
    return this.pos[0] + this.collideEdge[(this.direction+rotate)%4][2]
  },
  rightmost: function(rotate=0) {
    return this.pos[0] + this.collideEdge[(this.direction+rotate)%4][3]
  },
  rotateRight: function() {
    this.direction = (this.direction+1)%4
  },
  rotateLeft: function() {
    this.direction = (this.direction-1)%4
  },
}