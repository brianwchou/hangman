import HangmanJSON from './contracts/Hangman.json';
const ethers = require("ethers");

export default class Hangman {

  constructor(HangmanFactoryContract) {
    this.Factory = HangmanFactoryContract;
    this.Game = null;
    this.paymentAmount = 1;
    // TODO: Make payment dynamic based on current required value
  }

  setGame(gameAddress, signer) {
    const game = new ethers.Contract(
      gameAddress,
      HangmanJSON.abi,
      signer
    );
    this.Game = game
  }

  async getGame(userAddress) {
    return this.Game
  }

  async newGame(jobId, userAddress, signer, callback) {
    // Step 1: Request
    await this.Factory.requestCreateGame(ethers.utils.toUtf8Bytes(jobId), this.paymentAmount);
    // Step 2: Listen for Request
    await this.Factory.once("RequestCreateGame", async (owner, requestId) => {
      console.log("RequestCreateGame: request sent, awaiting response")
      console.log(owner)
      console.log(requestId)
    })
    // Step 3: Wait for Request to be answered
    await this.Factory.once("FulfillCreateGame", async (owner, requestId) => {
      console.log("FulfillCreateGame: request fulfilled, game is playable")
      console.log(owner)
      console.log(requestId)

      // Step 4: Initialize connect to Game Contract
      let gameStruct = await this.Factory.requestIdToGame(requestId)
      if (ethers.utils.getAddress(gameStruct[0]) !== ethers.utils.getAddress(userAddress)) {
        console.log("INVALID USER FOR GAME")
      }
      const game = new ethers.Contract(
        gameStruct[1],
        HangmanJSON.abi,
        signer
      );
      this.Game = game
      callback()
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

  async makeCharGuess(c) {
    let character = ethers.utils.toUtf8Bytes(c)
    await this.Game.makeCharGuess(character);
  }

  async makeWordGuess(w) {
    let word = ethers.utils.toUtf8Bytes(w)
    await this.Game.makeWordGuess(word);
  }

  async currentMisses() {
    return await this.Game.currentMisses();
  }

  async maxAllowedMisses() {
    return await this.Game.maxAllowedMisses();
  }
}
