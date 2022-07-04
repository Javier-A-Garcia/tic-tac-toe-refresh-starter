const Screen = require("./screen");
const Cursor = require("./cursor");

class TTT {

  constructor() {

    this.playerTurn = "O";

    this.grid = [[' ',' ',' '],
                 [' ',' ',' '],
                 [' ',' ',' ']]

    this.cursor = new Cursor(3, 3);

    // Initialize a 3x3 tic-tac-toe grid
    Screen.initialize(3, 3);
    Screen.setGridlines(true);

    // Replace this with real commands
    Screen.addCommand('w', 'Moves cursor up', TTT.moveUp.bind(this));
    Screen.addCommand('s', 'Moves cursor down', TTT.moveDown.bind(this));
    Screen.addCommand('a', 'Moves cursor left', TTT.moveLeft.bind(this));
    Screen.addCommand('d', 'Moves cursor right', TTT.moveRight.bind(this));
    Screen.addCommand('return', 'Place a move', TTT.placeMove.bind(this));

    this.cursor.setBackgroundColor();
    TTT.turnMessage.call(this);
    Screen.render();
    Screen.printCommands();
  }

  static turnMessage() {
    Screen.message = `It is ${this.playerTurn}'s turn`
  }

  static placeMove() {
    let row = this.cursor.row;
    let col = this.cursor.col;

    if (Screen.grid[row][col] === ' '){
      Screen.setGrid(row, col, this.playerTurn);

      let winner = TTT.checkWin(Screen.grid);

      if (winner) {
        TTT.endGame(winner);
      }

      if (this.playerTurn === 'O') {
        this.playerTurn = 'X'
      } else this.playerTurn = 'O';

      TTT.turnMessage.call(this);

      Screen.render();
      Screen.printCommands();

  } else {
      Screen.message = `Spot already taken`
      Screen.render();
      Screen.printCommands();
    }
  }

  static moveUp() {
    // let currentRow = this.cursor.row
    this.cursor.up();
  }

  static moveDown() {
    this.cursor.down();
  }

  static moveLeft() {
    this.cursor.left();
  }

  static moveRight() {
    this.cursor.right();
  }

  static checkRowWin(row) {
    let players = 'X,O'
    return (players.includes(row[0]) && row.every(v => v === row[0]))
  }

  static checkHorizontalWin(grid) {
    let winner = false;
    grid.forEach(row => {
      if (this.checkRowWin(row)) {
        winner = row[0]
      }
    });

    return winner;
  }
  static checkVerticalWin(grid) {
    let winner = false;

    grid.forEach((row, i) => {
      let newRow = []
      row.forEach((col, j) => {
        newRow.push(grid[j][i]);
      });
      if(this.checkRowWin(newRow)) {
        winner = newRow[0];
      }
    });

    return winner;
  }

  static checkDiagWin(grid) {
    let leftRight = [grid[0][0], grid[1][1], grid[2][2]];
    let rightLeft = [grid[0][2], grid[1][1], grid[2][0]];

    if (this.checkRowWin(leftRight)) {
      return leftRight[0]
    } else if(this.checkRowWin(rightLeft)){
      return rightLeft[0]
    } else return false;

  }

  static checkTie(grid) {
    let count = 0;
    grid.forEach(row => {
      row.forEach(col => {
        if (col !== ' ') {
          count++;
        }
      });
    });

    return (count === grid.length * grid.length)
  }
  /*
  grid[0][0] === grid[1][1] === grid[2][2]
  grid[0][2] === grid [1][1] === grid[2][0]
  */
  static checkWin(grid) {

    // Return 'X' if player X wins
    // Return 'O' if player O wins
    // Return 'T' if the game is a tie
    // Return false if the game has not ended
    let winner = false;

    if (!winner) {
      winner = this.checkHorizontalWin(grid);
    }
    if(!winner) {
      winner = this.checkVerticalWin(grid);
    }

    if (!winner) {
      winner = this.checkDiagWin(grid);
    }

    if (!winner) {
      if (this.checkTie(grid)) {
        winner = 'T'
      }
    }

    if(winner){
      TTT.endGame(winner)
    }

  }

  static endGame(winner) {
    if (winner === 'O' || winner === 'X') {
      Screen.setMessage(`Player ${winner} wins!`);
    } else if (winner === 'T') {
      Screen.setMessage(`Tie game!`);
    } else {
      Screen.setMessage(`Game Over`);
    }
    Screen.render();
    Screen.quit();
  }

}

module.exports = TTT;
