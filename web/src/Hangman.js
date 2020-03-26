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
    let address = ethers.utils.getAddress(gameAddress)
    console.log(`[Hangman]: setGame with ${address}`)
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
    console.log(`[Hangman]: newGame called`)
    // Step 1: Request
    await this.Factory.requestCreateGame(ethers.utils.toUtf8Bytes(jobId), this.paymentAmount);
    // Step 2: Listen for Request
    await this.Factory.once("RequestCreateGame", async (owner, requestId) => {
      console.log(`[FactoryContract] RequestCreateGame: (owner: ${owner}), (requestId: ${requestId})`)
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
      callback()
    })
  }

  async makeCharGuess(charInput, callback) {
    console.log(`[Hangman]: makeCharGuess called`)
    let character = ethers.utils.toUtf8Bytes(charInput)
    this.Game.once("TurnTaken", async () => {
      await callback()
    });
    console.log(1)
    await this.Game.makeCharGuess(character)
    console.log(2)
  }

  async makeWordGuess(wordInput, callback) {
    console.log(`[Hangman]: makeWordGuess called`)
    let word = ethers.utils.toUtf8Bytes(wordInput)
    this.Game.once("TurnTaken", async () => {
      await callback()
    });
    await this.Game.makeWordGuess(word)
  }

  async getNumberOfChars() {
    console.log(`[Hangman]: makeCharGuess called`)
    return await this.Game.getNumberOfCharacters();
  }

  async getUsedChars() {
    console.log(`[Hangman]: getUsedChars called`)
    const chars = await this.Game.getUsedCharacters()

    return ethers.utils.toUtf8String(chars);
  }

  async getCorrectlyGuessedChars() {
    console.log(`[Hangman]: getCorrectlyGuessedChars called`)
    const chars = await this.Game.getCorrectlyGuessedCharacters();

    return ethers.utils.toUtf8String(chars);
  }

  async currentMisses() {
    console.log(`[Hangman]: currentMisses called`)

    const misses = await this.Game.currentMisses();
    console.log(misses)
    return misses;
  }

  async maxAllowedMisses() {
    console.log(`[Hangman]: maxAllowedMisses called`)
    return await this.Game.maxAllowedMisses();
  }
}
