import generateTitle from './generators/titleZoneCreation';
import generateGameZone from './generators/gameZoneCreation';
import generateEndGameZone from './generators/endGameZoneCreation';
import GameManager from './GameManager';

const addTitleSection = () => {
  const titleDiv = document.getElementById('titleZoneId');
  if (titleDiv) {
    generateTitle(titleDiv);
  }
};

const addGameSection = () => {
  const gameZoneDiv = document.getElementById('gameZoneId');
  if (gameZoneDiv) {
    generateGameZone(gameZoneDiv);
  }
};

const disableGameElements = (...divIds) => {
  divIds.forEach((divId) => {
    const div = document.getElementById(divId);
    if (div) {
      div.classList.add('disable');
    }
  });
};

const showEndGameSection = () => {
  const endGameZoneDiv = document.getElementById('endGameZoneId');
  if (endGameZoneDiv) {
    generateEndGameZone(endGameZoneDiv);
    disableGameElements('gameZoneId', 'endGameZoneId');
  }
};

const generateHtml = () => {
  addTitleSection();
  addGameSection();
};

const callForNewGame = () => new Promise((resolve) => {
  const client = new XMLHttpRequest();
  client.open('GET', 'http://localhost:8080/getGame', true);
  client.onload = () => {
    if (client.readyState === 4) {
      if (client.status === 200) {
        resolve(client.responseText);
      } else {
        resolve(undefined);
      }
    }
  };
  client.send();
  return client.responseText;
});

async function selectGame(gameManager) {
  const response = await callForNewGame();
  if (response) {
    const game = JSON.parse(response);
    gameManager.newGame(game.map((cell) => {
      Object.assign(cell, { originalField: true });
      return cell;
    }));
  }
}

async function newGame(getPreviousGame) {
  const gameManager = GameManager.initGame();
  let gameLoaded = false;
  if (getPreviousGame) {
    gameLoaded = gameManager.loadExistingGame();
  }
  if (!gameLoaded) {
    await selectGame(gameManager);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  generateHtml();
  newGame(true);

  document.addEventListener('endGame', () => {
    showEndGameSection();
  });

  document.addEventListener('newGame', () => {
    newGame(false);
  });
});
