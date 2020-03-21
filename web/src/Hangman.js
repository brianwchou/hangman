import HangmanJSON from './contracts/Hangman.json';
const ethers = require("ethers");

export default class Hangman {

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

  async newGame(jobId, userAddress, signer) {
    await this.Factory.requestCreateGame(ethers.utils.toUtf8Bytes(jobId), this.paymentAmount);
    await this.Factory.once("RequestCreateGame", async (owner, requestId) => {
      console.log("RequestCreateGame: request sent, awaiting response")
      console.log(owner)
      console.log(requestId)
    })
    await this.Factory.once("FulfillCreateGame", async (owner, requestId) => {
      console.log("FulfillCreateGame: request fulfilled, game is playable")
      console.log(owner)
      console.log(requestId)

      let gameStruct = await this.Factory.requestIdToGame(requestId)
      if (ethers.utils.getAddress(gameStruct[0]) !== ethers.utils.getAddress(userAddress)) {
        console.log("INVALID USER FOR GAME")
      }

      console.log(gameStruct)
      const game = new ethers.Contract(
        gameStruct[1],
        HangmanJSON.abi,
        signer
      );

      this.Game = game
      console.log(this.Game)
    })
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
