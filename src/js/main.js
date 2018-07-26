import generateTitle from './generators/titleZoneCreation';
import generateGameZone from './generators/gameZoneCreation';
import generateEndGameZone from './generators/endGameZoneCreation';
import GameManager from './GameManager';
import game from '../games/game1';

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

const selectGame = () => game;

const newGame = (selectedGameData) => {
  GameManager.initGame(selectedGameData);
};


document.addEventListener('DOMContentLoaded', () => {
  generateHtml();
  newGame(selectGame());
  document.addEventListener('endGame', () => {
    showEndGameSection();
  });
});
