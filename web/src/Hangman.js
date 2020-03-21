const ethers = require("ethers");

class Hangman {

  constructor(HangmanFactoryContract) {
    this.Factory = HangmanFactoryContract;
    this.Game = null;
    this.paymentAmount = 1;
  }

  setGame(userAddress, gameAddress) {
    this.Game = gameAddress
  }

  async getGame(userAddress) {
    // fetches from factory if game is not set
    return this.Game
  }

  async newGame(jobId, userAddress) {
    await this.Factory.requestCreateGame(ethers.utils.toUtf8Bytes(jobId), this.paymentAmount);
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
