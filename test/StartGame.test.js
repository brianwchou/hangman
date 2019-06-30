const StartGame = artifacts.require("StartGame");
const Hangman = artifacts.require("Hangman");
const helper = require('ganache-time-traveler');
const truffleAssert = require('truffle-assertions');
const web3 = require('./utils.js');

const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

contract('StartGame', async (accounts) => {
    it("Test createHangmanContract does not return empty address", async() => {
        let startGame = await StartGame.new();
        let address = await startGame.createHangmanContract.call();

        assert.notEqual(address, EMPTY_ADDRESS, "address is not the null address");
    });
    
    it("Test deployed hangman contract owner", async() => {
        let startGame = await StartGame.new();
        let address = await startGame.createHangmanContract.call();
        let trx = await startGame.createHangmanContract();
        let hangmanContract = await Hangman.at(address);
        let isOwner = await hangmanContract.isOwner.call();
        
        assert.equal(isOwner, true, "Is owner should be true");
    });

});
