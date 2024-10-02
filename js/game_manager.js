function GameManager(gridSize, InputManager, Actuator, StorageManager, scoreGoal) {

  this.gridSize           = gridSize; // Size of the grid
  this.inputManager   = new InputManager;
  this.storageManager = new StorageManager;
  this.actuator       = new Actuator;
  this.scoreGoal = 2048;

  this.startTiles     = 2;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  rangeInput.addEventListener("input", () => {
    this.updateGoal();
  });

  this.setupGame();
}

const rangeInput = document.getElementById("rangeInput");
const rangeValueDisplay = document.getElementById("rangeValue");
const introDisplay = document.getElementById("intro");

// Default Values
rangeInput.value = 4;
rangeValueDisplay.textContent = 2048;

// Update the tile target
GameManager.prototype.updateGoal = function () {
  const sliderValue = parseInt(rangeInput.value);

  // Target is always a multiple of 2
  const tickValue = 128 * Math.pow(2, sliderValue);

  rangeValueDisplay.textContent = tickValue;
  introDisplay.textContent =  tickValue.toString()+" tile!";
  
  this.scoreGoal = tickValue;
  this.storageManager.clearGameState();
  this.setupGame();
  
};


GameManager.prototype.restart = function () {
  this.storageManager.clearGameState();
  this.actuator.continueGame(); // Clear the game won/lost message
  this.setupGame();
};

GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continueGame(); // Clear the game won/lost message
};


GameManager.prototype.isGameTerminated = function () {
  return this.gameOver || (this.won && !this.keepPlaying);
};

GameManager.prototype.setupGame = function () {
  let previousState = this.storageManager.getGameState();

  if (previousState) {
    this.grid        = new Grid(previousState.grid.size,
                                previousState.grid.cells); // Reload grid
    this.score       = previousState.score;
    this.gameOver    = previousState.gameOver;
    this.won         = previousState.won;
    this.keepPlaying = previousState.keepPlaying;
  } else {
    this.grid        = new Grid(this.gridSize);
    this.score       = 0;
    this.gameOver        = false;
    this.won         = false;
    this.keepPlaying = false;

    this.addStartTiles();
  }

  this.actuate();
};

GameManager.prototype.addStartTiles = function () {
  for (let i = 0; i < this.startTiles; i++) {
    this.addTileToRandomPosition();
  }
};

GameManager.prototype.addTileToRandomPosition = function () {
  if (this.grid.cellsAvailable()) {
    let value = Math.random() < 0.9 ? 2 : 4;
    let tile = new Tile(this.grid.randomAvailableCell(), value);

    this.grid.insertTile(tile);
  }
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  if (this.storageManager.getBestScore() < this.score) {
    this.storageManager.setBestScore(this.score);
  }

  if (this.gameOver) {
    this.storageManager.clearGameState();
  } else {
    this.storageManager.setGameState(this.serialize());
  }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    gameOver:   this.gameOver,
    won:        this.won,
    bestScore:  this.storageManager.getBestScore(),
    terminated: this.isGameTerminated()
  });

};

// Represent the current game as an object
GameManager.prototype.serialize = function () {
  return {
    grid:        this.grid.serialize(),
    score:       this.score,
    gameOver:    this.gameOver,
    won:         this.won,
    keepPlaying: this.keepPlaying
  };
};

GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

// TODO fill in 
GameManager.prototype.mergeTile = function(){

}

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
  let self = this;

  if (this.isGameTerminated()) return;

  let vector     = this.getVector(direction);
  let traversals = this.buildTraversals(vector);
  let moved      = false;

  this.prepareTiles();

  // TODO: extract to separate function + remove comments
  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      const hasMoved = self.mergeOrMoveTile(cell, self, vector);
      if (hasMoved){
        moved = true;
      }
    });
  });

  if (moved) {
    this.addTileToRandomPosition();

    if (!this.movesAvailable()) {
      this.gameOver = true; // Game over!
    }

    this.actuate();
  }
};

GameManager.prototype.mergeOrMoveTile = function (cell, self, vector){

  tile = self.grid.cellContent(cell);

  if (!tile) return;
  
  let positions = self.findFarthestPosition(cell, vector);
  let nextCell      = self.grid.cellContent(positions.nextCell);

  if (this.shouldBeMerged(tile, nextCell)) {
    //TODO extract to a function "mergeTile"
    let merged = new Tile(positions.nextCell, tile.value * 2);
    merged.mergedFrom = [tile, nextCell];

    self.grid.insertTile(merged);
    self.grid.removeTile(tile);

    // Converge the two tiles' positions
    tile.updatePosition(positions.nextCell);

    // Update the score
    self.score += merged.value;
    if (merged.value === this.scoreGoal) self.won = true;
  } else {
    self.moveTile(tile, positions.farthest);
  }

  if (!self.positionsEqual(cell, tile)) return true; // The tile moved from its original cell!
  
  return false;
};

GameManager.prototype.shouldBeMerged = function (tile, nextCell){
  return nextCell && nextCell.value === tile.value && !nextCell.mergedFrom
}

GameManager.prototype.getVector = function (direction) {
  let map = {
    0: { x: 0,  y: -1 }, // Up
    1: { x: 1,  y: 0 },  // Right
    2: { x: 0,  y: 1 },  // Down
    3: { x: -1, y: 0 }   // Left
  };

  return map[direction];
};

GameManager.prototype.buildTraversals = function (vector) {
  let traversals = { x: [], y: [] };

  for (let pos = 0; pos < this.gridSize; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.toReversed();
  if (vector.y === 1) traversals.y = traversals.y.toReversed();

  return traversals;
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  let previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    nextCell: cell
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function () {
  for (let x = 0; x < this.gridSize; x++) {
    for (let y = 0; y < this.gridSize; y++) {
      if (this.tilesMatch(x, y)) return true
    }
  }

  return false;
};

GameManager.prototype.tilesMatch = function(x, y){  
  let self = this;
  let tile;

  tile = this.grid.cellContent({ x: x, y: y });

  if (!tile) return false 
  for (let direction = 0; direction < 4; direction++) {
    let vector = self.getVector(direction);
    let cell   = { x: x + vector.x, y: y + vector.y };

    let other  = self.grid.cellContent(cell);

    if (other && other.value === tile.value) {
      return true;
    }
  }
}

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
