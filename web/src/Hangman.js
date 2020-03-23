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
      console.log(`[FactoryContract] RequestCreateGame: (owner: ${owner}), (requestId: ${requestId})`)
      callback.setBarCompleted(50)
    })
    // Step 3: Wait for Request to be answered
    await this.Factory.once("FulfillCreateGame", async (owner, requestId) => {
      console.log(`[FactoryContract] FulfillCreateGame: (owner: ${owner}), (requestId: ${requestId})`)
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
      callback.setBarCompleted(100)
      callback.changeScreen()
    })
  }

  async makeCharGuess(charInput, callbackAction) {
    console.log(this.Game)
    let character = ethers.utils.toUtf8Bytes(charInput)
    await this.Game.makeCharGuess(character)

    this.Game.once("TurnTaken", async () => {
      callbackAction()
    });
  }

  async makeWordGuess(wordInput, callbackAction) {
    let word = ethers.utils.toUtf8Bytes(wordInput)
    await this.Game.makeWordGuess(word)

    this.Game.once("TurnTaken", async () => {
      callbackAction()
    });
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

  async currentMisses() {
    return await this.Game.currentMisses();
  }

  async maxAllowedMisses() {
    return await this.Game.maxAllowedMisses();
  }
}
