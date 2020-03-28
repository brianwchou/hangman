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
    this.Game = game;
  }

  async getGame(userAddress) {
    return this.Game;
  }

  async newGame(jobId, userAddress, signer, callback) {
    console.log(`[Hangman]: newGame called`);
    // Step 1: Request
    await this.Factory.requestCreateGame(ethers.utils.toUtf8Bytes(jobId), this.paymentAmount);
    // Step 2: Listen for Request
    await this.Factory.once("RequestCreateGame", async (owner, requestId) => {
      console.log(`[FactoryContract]: RequestCreateGame: (owner: ${owner}), (requestId: ${requestId})`);
    })
    // Step 3: Wait for Request to be answered
    await this.Factory.once("FulfillCreateGame", async (owner, requestId) => {
      console.log(`[FactoryContract]: FulfillCreateGame: (owner: ${owner}), (requestId: ${requestId})`);
      // Step 4: Initialize connect to Game Contract
      let gameStruct = await this.Factory.requestIdToGame(requestId)
      if (ethers.utils.getAddress(gameStruct[0]) !== ethers.utils.getAddress(userAddress)) {
        console.log(`[ERROR]: INVALID USER FOR GAME`);
      }
      const game = new ethers.Contract(
        gameStruct[1],
        HangmanJSON.abi,
        signer
      );
      this.Game = game;
      callback();
    })
  }

  async makeCharGuess(charInput, callback) {
    console.log(`[Hangman]: makeCharGuess called`);
    let character = ethers.utils.toUtf8Bytes(charInput);
    this.Game.once("TurnTaken", async () => {
      await callback();
    });
    await this.Game.makeCharGuess(character);
  }

  async makeWordGuess(wordInput, callback) {
    console.log(`[Hangman]: makeWordGuess called`);
    let word = ethers.utils.toUtf8Bytes(wordInput);
    this.Game.once("TurnTaken", async () => {
      await callback();
    });
    await this.Game.makeWordGuess(word);
  }

  async getNumberOfChars() {
    const numOfChar = await this.Game.getNumberOfCharacters();
    console.log(`[Hangman]: getNumberOfChars ${numOfChar}`);
    return numOfChar;
  }

  async getUsedChars() {
    const chars = await this.Game.getUsedCharacters();
    const formated_chars = ethers.utils.toUtf8String(chars);
    
    let chars_to_display = '';
    for (let i = 0; i < formated_chars.length; i++) {
      if (i === formated_chars.length - 1) {
        chars_to_display += formated_chars[i]; 
      } else {
        chars_to_display += formated_chars[i] + ' ';
      }
    }
    console.log(`[Hangman]: getUsedChars ${chars_to_display}`);
    return chars_to_display;
  }

  async getCorrectlyGuessedChars() {
    const hexChars = await this.Game.getCorrectlyGuessedCharacters();
    let displayChars = hexChars.reduce((accumulator, hex) => {
      if (hex !== '0x00') {
        accumulator += (` ${ethers.utils.toUtf8String(hex)} `);
      } else {
        accumulator += (' _ ');
      }
      return accumulator
    }, "")
    console.log(`[Hangman]: getCorrectlyGuessedChars ${displayChars}`);
    return displayChars;
  }

  async currentMisses() {
    const misses = await this.Game.currentMisses();
    console.log(`[Hangman]: currentMisses ${misses}`);
    return misses;
  }

  async maxAllowedMisses() {
    const max = await this.Game.maxAllowedMisses();
    console.log(`[Hangman]: maxAllowedMisses ${max}`);
    return max;
  }
}
