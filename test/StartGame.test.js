const StartGame = artifacts.require("StartGame");
const Hangman = artifacts.require("Hangman");
const helper = require('ganache-time-traveler');
const truffleAssert = require('truffle-assertions');
const utils = require('./utils.js');
const web3 = utils.getWeb3();

const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

contract('StartGame', async (accounts) => {

  let startGame;
  let linkTokenAddress = accounts[2];
  let oracleAddress = accounts[3];
  let url = "https://en.wikipedia.org/api/rest_v1/page/random/title";
  let path = "items[0].title";

  before('deploy StartGame', async() => {
      startGame = await StartGame.new(linkTokenAddress, oracleAddress, url, path);
  });

  describe("Test initial values", async () => {
    it("Test url", async() => {
    })
    
    it("Test path", async() => {
    })

    it("Test chainlink token address", async() => {
    })

    it("Test oracle address", async() => {
    })
  });

  describe("Test createHangmanContact", async () => {
    it("Test createHangmanContract does not return empty address", async() => {
        let address = await startGame.createHangmanContract.call();
        assert.notEqual(address, EMPTY_ADDRESS, "address is not the null address");
    });
    
    it("Test owner of deployed contact", async() => {
        let address = await startGame.createHangmanContract.call();
        let trx = await startGame.createHangmanContract();
        let hangmanContract = await Hangman.at(address);
        let owner = await hangmanContract.owner.call();
        assert.equal(owner, accounts[0], "Is owner should be true");
    });
  });
});
