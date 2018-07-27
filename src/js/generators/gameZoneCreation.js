const createNewLine = () => document.createElement('br');

const generateInnerTable = (gridLineNr, gridColNr) => {
  const innerTable = document.createElement('table');
  innerTable.classList.add('gameTableArea');
  for (let i = 0; i < 3; i += 1) {
    const lineTr = document.createElement('tr');
    for (let j = 0; j < 3; j += 1) {
      const cellTd = document.createElement('td');
      cellTd.classList.add('gameCell');
      const span = document.createElement('span');
      cellTd.innerHTML = ' ';
      const coordx = gridColNr * 3 + j + 1;
      const coordy = gridLineNr * 3 + i + 1;

      cellTd.setAttribute('coordx', coordx);
      cellTd.setAttribute('coordy', coordy);
      cellTd.appendChild(span);
      lineTr.appendChild(cellTd);
    }
    innerTable.appendChild(lineTr);
  }
  return innerTable;
};

const generateGameTable = () => {
  const gameTable = document.createElement('table');
  gameTable.classList.add('gameTable');
  for (let i = 0; i < 3; i += 1) {
    const lineTr = document.createElement('tr');
    for (let j = 0; j < 3; j += 1) {
      const tableAreaTd = document.createElement('td');
      tableAreaTd.classList.add('tableArea');
      tableAreaTd.appendChild(generateInnerTable(i, j));
      lineTr.appendChild(tableAreaTd);
    }
    gameTable.appendChild(lineTr);
  }
  return gameTable;
};

const generateGameBoard = () => {
  const gameBoardDiv = document.createElement('div');
  gameBoardDiv.classList.add('gameBoard');
  gameBoardDiv.appendChild(generateGameTable());
  return gameBoardDiv;
};

const onClickGameNumberBtn = (value) => {
  const event = new CustomEvent('numberClicked', {
    detail: {
      value
    }
  });
  document.dispatchEvent(event);
};

const generateGameNumbers = () => {
  const gameNumbersDiv = document.createElement('div');
  gameNumbersDiv.classList.add('gameNumbers');

  function createButton(btnValue, text) {
    const btn = document.createElement('BUTTON');
    btn.classList.add('btn');
    btn.classList.add('gameNumber');
    btn.setAttribute('type', 'button');
    btn.setAttribute('value', btnValue);
    const btnText = document.createTextNode(text);
    btn.appendChild(btnText);
    btn.onclick = () => onClickGameNumberBtn(`${btnValue}`);
    gameNumbersDiv.appendChild(btn);
  }

  for (let i = 1; i <= 9; i += 1) {
    createButton(i, i);
  }
  createButton('', 'Eraser');
  return gameNumbersDiv;
};

const generateGameZone = (gameZoneDiv) => {
  if (!gameZoneDiv) {
    return;
  }
  gameZoneDiv.classList.add('gameZone');
  gameZoneDiv.appendChild(generateGameBoard());
  gameZoneDiv.appendChild(createNewLine());
  gameZoneDiv.appendChild(createNewLine());
  gameZoneDiv.appendChild(generateGameNumbers());
};


document.addEventListener('numberClicked', ({ detail: { value } }) => {
  // unmark old btn
  const btn = document.querySelector('.btn.gameNumber.marked');
  if (btn) {
    btn.classList.remove('marked');
  }

  // mark the button
  const newBtn = document.querySelector(`.btn.gameNumber[value="${value}"]`);
  if (newBtn) {
    newBtn.classList.add('marked');
  }
});

export default generateGameZone;
