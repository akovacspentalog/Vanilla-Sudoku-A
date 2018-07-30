const fs = require('fs');
const { errorLog, log: logger } = require('./logger');
const { gamesPath } = require('./configs');

class GameFetcher {
  constructor() {
    this.gameList = [];
    fs.readFile(gamesPath, (err, data) => this.loadReadGames(err, data));
  }

  loadReadGames(err, data) {
    if (err) {
      errorLog.error(err);
    } else {
      logger.debug(`file read: ${data}`);
      const promisedData = GameFetcher.parseData(data);
      this.saveData(promisedData);
    }
  }

  async saveData(promisedData) {
    logger.debug('saving the Data');
    const result = await promisedData;
    logger.debug(`promised data arrived: ${result}`);
    this.gameList = result;
  }

  fetch() {
    const nrOfGamesAvailable = this.gameList.length;
    if (nrOfGamesAvailable === 0) {
      return undefined;
    }
    const gameNr = Math.floor(Math.random() * nrOfGamesAvailable);
    logger.info(`Fetching game #${gameNr} from ${nrOfGamesAvailable} games ...`);
    return this.gameList[gameNr];
  }

  static parseData(dataBuffer) {
    let data = dataBuffer.toString();
    logger.debug('parsing data');

    return new Promise((resolve) => {
      const parsedData = [];
      data = data.substr(data.indexOf('\n') + 1); // skip first line!
      let done = false;
      let gameLine;
      while (!done) {
        gameLine = data.substr(0, data.indexOf('\n') + 1); // fix line size!
        logger.debug(`gameLine: ${gameLine}`);
        if (gameLine.length === 0) {
          done = true;
        } else {
          const gameNr = gameLine.substr(0, gameLine.indexOf('\t'));
          const puzzle = gameLine.substr(gameLine.indexOf('\t') + 1, 9 * 9);
          const solution = gameLine.substr(gameNr.length + 1 + puzzle.length + 1, 9 * 9);
          logger.debug(`gameNr: ${gameNr}`);
          logger.debug(`puzzle: ${puzzle}`);
          logger.debug(`solution: ${solution}`);
          data = data.substr(data.indexOf('\n') + 1);

          const game = [];
          for (let i = 0; i < 81; i += 1) {
            const value = puzzle[i];
            if (value !== '0') {
              game.push({
                y: Math.floor(i / 9),
                x: i % 9,
                value
              });
            }
          }
          parsedData.push(game);
        }
      }
      resolve(parsedData);
    });
  }
}

const gameFetcher = new GameFetcher();
module.exports = gameFetcher;
