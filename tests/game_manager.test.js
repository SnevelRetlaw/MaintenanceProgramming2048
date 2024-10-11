
const GameManager = require('../js/game_manager.js');
const Tile = require('../js/tile.js');
const Grid = require('../js/grid.js');
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

        test('should set up with 2 tiles', () => {
            gameManager.setup();
            const tileCount = gameManager.grid.cells.flat().filter(cell => cell !== null).length;
            expect(tileCount).toBe(2);             
        });
    });

    describe('Move Functionality', () => {
        beforeEach(() => {
            gameManager = new GameManager(4, mockInputManager, mockActuator, mockStorageManager);
            gameManager.grid = new Grid(4);
            gameManager.score = 0;
        });

        test('should not add random tile if game is over', () => {
            gameManager.over = true; 
         
            const addRandomTileMock = jest.spyOn(gameManager, 'addRandomTile');  

            gameManager.move(0); 
               
            expect(addRandomTileMock).not.toHaveBeenCalled();
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
       
        test('should add random tile if there are moves available', () => {
            gameManager.grid.insertTile(new Tile({ x: 0, y: 0 }, 2));
            gameManager.grid.insertTile(new Tile({ x: 1, y: 0 }, 2));
    
            const addRandomTileMock = jest.spyOn(gameManager, 'addRandomTile');
            gameManager.movesAvailable = jest.fn(() => true); 
    
            gameManager.move(0); 
    
            expect(addRandomTileMock).toHaveBeenCalled(); 
        });
        
    
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
        
    });
});