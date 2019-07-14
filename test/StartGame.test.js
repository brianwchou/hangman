const StartGame = artifacts.require("StartGame");
const Hangman = artifacts.require("Hangman");
const MockContract = artifacts.require("MockContract");
const Oracle = artifacts.require("Oracle");
const LinkToken = artifacts.require("LinkToken");
const helper = require('ganache-time-traveler');
const truffleAssert = require('truffle-assertions');
const utils = require('./utils.js');
const web3 = utils.getWeb3();

const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

contract.only('StartGame', async (accounts) => {
  let startGame;
  let mockLinkToken;
  let mockOracle = accounts[9];
  let player = accounts[0];
  let url = "https://en.wikipedia.org/api/rest_v1/page/random/title";
  let path = "items[0].title";

  before('deploy StartGame', async() => {
      let linkTokenTemplate = await LinkToken.new();
      mockLinkToken = await MockContract.new();

      //mock LinkToken.transferAndCall()
      let mockLink_transferAndCall = 
        linkTokenTemplate.contract.methods
          .transferAndCall(EMPTY_ADDRESS, 0, web3.toHex("0"))
          .encodeABI();
      await mockLinkToken.givenMethodReturnBool(mockLink_transferAndCall, true);

      startGame = await StartGame.new(mockLinkToken.address, mockOracle, url, path);
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

  describe("Test creation of hangman contract game", async () => {
    it("Test requestStartGame is successful in requesting to start a game", async() => {
        //perform a mock call to ensure we get a requestId
        let requestId = await startGame.requestStartGame.call(1);
        assert.isOk(requestId, "a request id was not returned");

        //perform actual transaction call
        let trx = await startGame.requestStartGame(1);
        let game = await startGame.requestIdToGame(requestId);
        assert.equal(game[0], player, "saving game instance was unsuccessful");
        assert.equal(game[1], EMPTY_ADDRESS, "saving game instance was unsuccessful");
    });
    
    it("Test fullfillStartGame is susccessful in creating a Hangman contract", async() => {
        let requestId = await startGame.requestStartGame.call(1);
        let trx = await startGame.requestStartGame(1);
      
        //call the fullfillStartGame with data that mocks
        let bytesVal = web3.toHex("testing");
        console.log(bytesVal);
        await startGame.fullfillStartGame(requestId, bytesVal, { from: mockOracle });
        let game = await startGame.requestIdToGame(requestId);
        assert.equal(game[0], player, "saving game instance was unsuccessful");
        assert.isOk(game[1], "saving game instance was unsuccessful");

        let hangman = await Hangman.at(game[1]);
        let owner = await hangman.owner.call();
        assert.equal(owner, player, "player is not the owner of hangman contract");

        trx = await hangman.makeWordGuess(web3.toHex("testing"));
        console.log(trx);
    });
  });
});
