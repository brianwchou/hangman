const ethers = require("ethers");

class Hangman {

  constructor(HangmanFactoryContract) {
    this.Factory = HangmanFactoryContract;
    this.Game = None;
  }

  function setGame(userAddress) {
    this.Game = Game
  }

  async getGame(userAddress) {
    // fetches from factory if game is not set
    return this.Game
  }

  async newGame(jobId, userAddress) {
    // call factory
    // listen for event
    // return new game address
  }

  async getNumberOfChars() {
    return await this.Game.getNumberOfCharacters();
  }

  async getUsedChars() {
    return await this.Game.getUsedCharacters();
  }

  async getCorrectlyGuessedChars() {
    return await this.Game.getCorrectlyGuessedCharacters();
  }

  async makeCharGuess(character) {
    await this.Game.makeCharGuess(character);
  }

  async makeWordGuess(word) {
    await this.Game.makeWordGuess(word);
  }

  async currentMisses() {
    return await this.Game.currentMisses();
  }

  async maxAllowedMisses() {
    return await this.Game.maxAllowedMisses();
  }
}


module.exports = Hangman;
