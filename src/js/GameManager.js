const applyEventListeners = (gameManager) => {
  document.addEventListener('cellClicked', ({ detail: { x: coordX, y: coordY } }) => {
    gameManager.onCellClicked(coordY, coordX);
  });
};

class GameManager {
  constructor(gameData) {
    this.initialBoard = GameManager.convertInitialData(gameData);
    this.initialiseGameBoard();
    this.applyInitialBoard();
    applyEventListeners(this);
  }


  initialiseGameBoard() {
    this.gameBoard = [];
    for (let y = 0; y < 9; y += 1) {
      this.gameBoard[y] = [];
      for (let x = 0; x < 9; x += 1) {
        this.gameBoard[y][x] = this.getCoords(y, x);
      }
    }
  }

  applyInitialBoard() {
    const cells = GameManager.getAllCells();
    for (let i = 0; i < cells.length; i += 1) {
      const cell = cells.item(i);
      const coordy = cell.getAttribute('coordy');
      const coordx = cell.getAttribute('coordx');
      const value = this.getCoords(coordy - 1, coordx - 1);
      if (value > 0) {
        cell.setAttribute('value', value);
        cell.firstElementChild.innerHTML = value;
        cell.classList.add('initialValue');
      } else {
        cell.setAttribute('value', 0);
        cell.onclick = GameManager.generateOnClickEventForCell(coordy, coordx);
      }
    }
  }


  getCoords(coordY, coordX) {
    return this.initialBoard[coordY] && this.initialBoard[coordY][coordX] ? this.initialBoard[coordY][coordX].toString() : '';
  }

  onCellClicked(coordY, coordX) {
    const newValue = GameManager.getMarkedValue();
    if (!newValue && newValue !== '') {
      return;
    }
    const cell = document.querySelector(`[coordx="${coordX}"][coordy="${coordY}"]`);
    if (!cell.classList.contains('initialValue')) {
      cell.firstElementChild.innerHTML = newValue;
    }
    cell.setAttribute('value', newValue);
    this.gameBoard[coordY - 1][coordX - 1] = newValue;
    this.validateBoard();
  }

  validateBoard() {
    // clean all board of invalid flag
    document.querySelectorAll('.gameCell.invalid')
      .forEach((node) => {
        node.classList.remove('invalid');
      });

    // Test each number
    for (let number = 1; number <= 9; number += 1) {
      // for each row
      this.validateRows(number);

      // for each column
      this.validateColumns(number);

      // for each square
      this.validateSquares(number);
    }

    GameManager.checkEndGame();
  }


  static checkEndGame() {
    const hasInvalidCells = document.querySelector('.gameCell.invalid');
    if (hasInvalidCells) {
      return;
    }
    const hasEmptyCells = document.querySelector('.gameCell[value="0"]');
    if (hasEmptyCells) {
      return;
    }
    document.dispatchEvent(new Event('endGame'));
  }

  validateRows(number) {
    for (let y = 0; y < 9; y += 1) {
      const row = this.gameBoard[y];
      const count = row.filter(value => value === number.toString()).length;
      if (count > 1) {
        new Array(...document.querySelectorAll(`.gameCell[coordy="${y + 1}"][value="${number}"]`))
          .filter(cell => !cell.classList.contains('invalid'))
          .forEach(cell => cell.classList.add('invalid'));
      }
    }
  }

  validateColumns(number) {
    for (let x = 0; x < 9; x += 1) {
      const count = this.gameBoard.map(row => row[x])
        .filter(value => value === number.toString()).length;
      if (count > 1) {
        new Array(...document.querySelectorAll(`.gameCell[coordx="${x + 1}"][value="${number}"]`))
          .filter(cell => !cell.classList.contains('invalid'))
          .forEach(cell => cell.classList.add('invalid'));
      }
    }
  }

  validateSquares(number) {
    for (let squareY = 0; squareY < 3; squareY += 1) {
      for (let squareX = 0; squareX < 3; squareX += 1) {
        let count = 0;
        for (let y = 0; y < 3; y += 1) {
          for (let x = 0; x < 3; x += 1) {
            if (this.gameBoard[squareY * 3 + y][squareX * 3 + x] === number.toString()) {
              count += 1;
            }
            if (count >= 2) {
              break;
            }
          }
          if (count >= 2) {
            break;
          }
        }
        if (count >= 2) {
          for (let coordY = 1; coordY <= 3; coordY += 1) {
            for (let coordX = 1; coordX <= 3; coordX += 1) {
              const cell = document.querySelector(`.gameCell[coordy="${squareY * 3 + coordY}"][coordx="${squareX * 3 + coordX}"][value="${number}"]`);
              if (cell) {
                cell.classList.add('invalid');
              }
            }
          }
        }
      }
    }
  }

  static initGame(gameData) {
    return new GameManager(gameData);
  }

  static convertInitialData(gameData) {
    const resultData = [];
    gameData.forEach(({ y, x, value }) => {
      if (!resultData[y]) {
        resultData[y] = [];
      }
      resultData[y][x] = value;
    });

    return resultData;
  }

  static generateOnClickEventForCell(coordy, coordx) {
    return () => {
      const event = new CustomEvent('cellClicked', {
        detail: {
          y: `${coordy}`,
          x: `${coordx}`
        }
      });
      document.dispatchEvent(event);
    };
  }

  static getMarkedValue() {
    const btn = document.querySelector('.btn.gameNumber.marked');
    return btn ? btn.value : undefined;
  }

  static getAllCells() {
    return document.getElementsByClassName('gameCell');
  }
}

export default GameManager;