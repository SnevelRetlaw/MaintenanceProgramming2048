global.Grid = jest.fn().mockImplementation((size) => ({
  size: size,
  cells: Array(size)
    .fill()
    .map(() => Array(size).fill(null)),
  availableCells: jest.fn(() => [{ x: 0, y: 0 }]),
  randomAvailableCell: jest.fn(() => ({ x: 0, y: 0 })),
  insertTile: jest.fn(),
  removeTile: jest.fn(),
  withinBounds: jest.fn(() => true),
  cellsAvailable: jest.fn(() => true),
  cellOccupied: jest.fn(() => false),
  cellContent: jest.fn(() => null),
  eachCell: jest.fn(),
  serialize: jest.fn(() => ({ size: size, cells: [] })),
}));

global.Tile = jest.fn().mockImplementation((position, value) => ({
  x: position.x,
  y: position.y,
  value: value,
  updatePosition: jest.fn(),
}));

const innerHTML = require("./html_string_test.js");
const GameManager = require("../js/game_manager.js");

const mockInputManager = {
  on: jest.fn(),
};

const mockActuator = {
  actuate: jest.fn(),
  continueGame: jest.fn(),
};

const mockStorageManager = {
  getGameState: jest.fn(() => null),
  clearGameState: jest.fn(),
  setGameState: jest.fn(),
  getBestScore: jest.fn(() => 0),
  setBestScore: jest.fn(),
};

describe("GameManager", () => {
  let gameManager;

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = innerHTML; // 添加html到模拟dom环境中可以在代码中获取dom元素
    gameManager = new GameManager(
      4,
      function () {
        return mockInputManager;
      },
      function () {
        return mockActuator;
      },
      function () {
        return mockStorageManager;
      } // 箭头函数是不能new对象的因为没有自己的this
    );
  });

  test("initialization", () => {
    expect(gameManager.gridSize).toBe(4);
    expect(gameManager.startTiles).toBe(2);
    expect(gameManager.inputManager).toBeDefined();
    expect(gameManager.storageManager).toBeDefined();
    expect(gameManager.actuator).toBeDefined();
    expect(gameManager.grid).toBeDefined();
    expect(gameManager.score).toBe(0);
    expect(gameManager.gameOver).toBe(false);
    expect(gameManager.won).toBe(false);
    expect(gameManager.keepPlaying).toBe(false);
  });

  test("restart", () => {
    const setupGame = jest.spyOn(gameManager, "setupGame");
    gameManager.restart();
    expect(mockStorageManager.clearGameState).toHaveBeenCalled();
    expect(mockActuator.continueGame).toHaveBeenCalled();
    expect(setupGame).toHaveBeenCalled();
  });

  test('keepPlayingFn', () => {
    gameManager.keepPlayingFn();
    expect(gameManager.keepPlaying).toBe(true);
    expect(mockActuator.continueGame).toHaveBeenCalled();
  });

  test('isGameTerminated', () => {
    expect(gameManager.isGameTerminated()).toBe(false);
    gameManager.gameOver = true;
    expect(gameManager.isGameTerminated()).toBe(true);
    gameManager.gameOver = false;
    gameManager.won = true;
    expect(gameManager.isGameTerminated()).toBe(true);
    gameManager.keepPlaying = true;
    expect(gameManager.isGameTerminated()).toBe(false);
  });

  test("addStartTiles", () => {
    gameManager.addStartTiles();
    expect(gameManager.grid.randomAvailableCell).toHaveBeenCalled();
    expect(gameManager.grid.insertTile).toHaveBeenCalled();
    expect(global.Tile).toHaveBeenCalled();
  });

  test('moveTile', () => {
    const tile = {
      x: 0,
      y: 0,
      value: 2,
      updatePosition: jest.fn(callback),
    };
    function callback(){
      tile.x = 1
      tile.y = 1
    }
    const cell = { x: 1, y: 1 };
    gameManager.moveTile(tile, cell);
    expect(gameManager.grid.cells[0][0]).toBeNull();
    expect(gameManager.grid.cells[1][1]).toBe(tile);
    expect(tile.x).toBe(1);
    expect(tile.y).toBe(1);
  });

  test('move', () => {
    const direction = 0; // up
    const prepareTiles = jest.spyOn(gameManager, "prepareTiles");
    const getVector = jest.spyOn(gameManager, "getVector");
    const buildTraversals = jest.spyOn(gameManager, "buildTraversals");
    gameManager.move(direction);
   
    expect(prepareTiles).toHaveBeenCalled();
    expect(getVector).toHaveBeenCalled();
    expect(buildTraversals).toHaveBeenCalled();
    expect(mockActuator.actuate).toHaveBeenCalled();
  });

  test("tileMatchesAvailable", () => {
    const tilesMatch = jest.spyOn(gameManager, "tilesMatch");
    gameManager.tileMatchesAvailable();
    expect(tilesMatch).toHaveBeenCalled();
  });

  test("updateGoal", () => {
    const clearGameState = jest.spyOn(
      gameManager.storageManager,
      "clearGameState"
    );
    const setupGame = jest.spyOn(gameManager, "setupGame");
    gameManager.updateGoal();
    expect(clearGameState).toHaveBeenCalled();
    expect(setupGame).toHaveBeenCalled();
  });
});