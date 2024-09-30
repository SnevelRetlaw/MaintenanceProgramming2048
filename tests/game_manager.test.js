const GameManager = require('../js/game_manager.js');
const Grid = require('../js/grid.js');
const Tile = require('../js/tile.js');

describe('GameManager', () => {
    let gameManager;
    let mockInputManager;
    let mockActuator;
    let mockStorageManager;

    beforeEach(() => {
      
        mockInputManager = jest.fn().mockImplementation(() => ({
            on: jest.fn(),
        }));

        mockActuator = jest.fn().mockImplementation(() => ({
            actuate: jest.fn(),
            continueGame: jest.fn(),
        }));

        mockStorageManager = jest.fn().mockImplementation(() => ({
            getGameState: jest.fn(),
            clearGameState: jest.fn(),
            setGameState: jest.fn(),
            getBestScore: jest.fn(() => 0),
            setBestScore: jest.fn(),
        }));

        gameManager = new GameManager(4, mockInputManager, mockActuator, mockStorageManager);
        // gameManager.grid = new Grid(4); 
        // gameManager.score = 0; 
        // gameManager.over = false; 
    });

    describe('Automatic Initialization', () => {
        test('should initialize the game correctly', () => {
            expect(gameManager.size).toBe(4);
            expect(gameManager.startTiles).toBe(2);
            expect(mockInputManager).toHaveBeenCalledTimes(1);
            expect(mockActuator).toHaveBeenCalledTimes(1);
            expect(mockStorageManager).toHaveBeenCalledTimes(1);
            expect(mockStorageManager.mock.results[0].value.getGameState).toHaveBeenCalled();
        });
    });

    describe('Game Control', () => {
        beforeEach(() => {
            // Mock setup method to track its calls
            gameManager.setup = jest.fn();
        });
        test('restart should clear game state and setup the game', () => {
            gameManager.restart();

            expect(mockStorageManager.mock.results[0].value.clearGameState).toHaveBeenCalledTimes(1);
            expect(mockActuator.mock.results[0].value.continueGame).toHaveBeenCalledTimes(1);
            expect(gameManager.setup).toHaveBeenCalled();
        });

        //error
        // test('keepPlaying should set keepPlaying to true and clear the game message', () => {
        //     gameManager.keepPlaying();
    
        //     expect(gameManager.keepPlaying).toBe(true);
        //     expect(mockActuator.mock.results[0].value.continueGame).toHaveBeenCalled();
        // });

    
        test('isGameTerminated should return true if game is over or won without keepPlaying', () => {
            gameManager.over = true;
            expect(gameManager.isGameTerminated()).toBe(true);

            gameManager.over = false;
            gameManager.won = true;
            gameManager.keepPlaying = false;
            expect(gameManager.isGameTerminated()).toBe(true);

            gameManager.keepPlaying = true;
            expect(gameManager.isGameTerminated()).toBe(false);
        });

        // test('setup should add start tiles when no previous state exists', () => {
        //   gameManager.setup();
        //   mockStorageManager.mock.results[0].value.clearGameState
        //   expect(mockGrid).toHaveBeenCalledTimes(1);
        // });
    });

    describe('Move Functionality', () => {
        beforeEach(() => {
            gameManager = new GameManager(4, mockInputManager, mockActuator, mockStorageManager);
            gameManager.grid = new Grid(4);
            gameManager.score = 0;
            // gameManager.over = false;
        });
        test('should not move if game is over', () => {
            gameManager.over = true; 

            gameManager.move(0); 

            expect(gameManager.score).toBe(0); 
            expect(mockActuator().actuate).not.toHaveBeenCalled(); 
        });
    

        test('should move tiles and update score', () => {
            
            gameManager.grid.insertTile(new Tile({ x: 0, y: 0 }, 2));
            gameManager.grid.insertTile(new Tile({ x: 0, y: 1 }, 2));

            gameManager.move(0); 

            expect(gameManager.score).toBe(4); 
            expect(gameManager.grid.cellContent({ x: 0, y: 0 }).value).toBe(4); 
            expect(gameManager.grid.cellContent({ x: 0, y: 1 })).toBeNull(); 
        });
        //error
        // test('should add random tile after move', () => {
            
        //     gameManager.grid.insertTile(new Tile({ x: 0, y: 0 }, 2));
        //     gameManager.grid.insertTile(new Tile({ x: 1, y: 0 }, 2));

        //     // Mock addRandomTile
        //     gameManager.addRandomTile = jest.fn();

        //     gameManager.move(0); 

        //     expect(gameManager.addRandomTile).toHaveBeenCalled(); 
        // });
    
        // test('should end the game if no moves available', () => {
            
        //     gameManager.grid.insertTile(new Tile({ x: 0, y: 0 }, 2));
        //     gameManager.grid.insertTile(new Tile({ x: 0, y: 1 }, 4));
        //     gameManager.grid.insertTile(new Tile({ x: 0, y: 2 }, 2));
        //     gameManager.grid.insertTile(new Tile({ x: 0, y: 3 }, 4));
        //     gameManager.grid.insertTile(new Tile({ x: 1, y: 0 }, 4));
        //     gameManager.grid.insertTile(new Tile({ x: 1, y: 1 }, 2));
        //     gameManager.grid.insertTile(new Tile({ x: 1, y: 2 }, 4));
        //     gameManager.grid.insertTile(new Tile({ x: 1, y: 3 }, 2));
        //     gameManager.grid.insertTile(new Tile({ x: 2, y: 0 }, 2));
        //     gameManager.grid.insertTile(new Tile({ x: 2, y: 1 }, 4));
        //     gameManager.grid.insertTile(new Tile({ x: 2, y: 2 }, 2));
        //     gameManager.grid.insertTile(new Tile({ x: 2, y: 3 }, 4));
        //     gameManager.grid.insertTile(new Tile({ x: 3, y: 0 }, 4));
        //     gameManager.grid.insertTile(new Tile({ x: 3, y: 1 }, 2));
        //     gameManager.grid.insertTile(new Tile({ x: 3, y: 2 }, 4));
        //     gameManager.grid.insertTile(new Tile({ x: 3, y: 3 }, 2));
            
            
        //     gameManager.movesAvailable = jest.fn(() => false);

        //     gameManager.move(0); 
        //     console.log('Game Over Status:', gameManager.over);

        //     expect(gameManager.over).toBe(true); 
        // });
        // test('move should call prepareTiles and moveTile', () => {
        //     // Mocking internal methods to track calls
        //     gameManager.prepareTiles = jest.fn();
        //     gameManager.moveTile = jest.fn();
        //     gameManager.addRandomTile = jest.fn();
        //     gameManager.movesAvailable = jest.fn(() => true);
        //     gameManager.grid.insertTile(new Tile({ x: 0, y: 0 }, 2));
        //     gameManager.grid.insertTile(new Tile({ x: 0, y: 1 }, 4));

        //     gameManager.move(2); 

        //     expect(gameManager.prepareTiles).toHaveBeenCalled();
        //     expect(gameManager.addRandomTile).toHaveBeenCalled();
        //     expect(gameManager.moveTile).toHaveBeenCalled();
        // });
    });
});