const StartGame = artifacts.require("StartGame");
const Hangman = artifacts.require("Hangman");
const Oracle = artifacts.require("Oracle");
const LinkToken = artifacts.require("LinkToken");
const MockContract = artifacts.require("MockContract");
const helper = require('ganache-time-traveler');
const truffleAssert = require('truffle-assertions');
const utils = require('./utils.js');
const web3 = utils.getWeb3();

const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

contract('StartGame', async (accounts) => {

  let startGame;
  let mockLinkToken;
  let mockOracle;
  let linkTokenAddress = accounts[2];
  let oracleAddress = accounts[3];
  let url = "https://en.wikipedia.org/api/rest_v1/page/random/title";
  let path = "items[0].title";

  before('deploy StartGame', async() => {
      let linkTokenTemplate = await LinkToken.new();
      let mockLinkToken = await MockContract.new();

      let oracleTemplate = await Oracle.new(0);
      let mockOracle = await MockContract.new();

      //mock LinkToken.transferAndCall()
      let mockLink_transferAndCall = 
        linkTokenTemplate.contract.methods.transferAndCall(0, 0, 0).encodeABI();
      await mockLinkToken.givenMethodReturnBool(mockLink_transferAndCall, true);

      startGame = await StartGame.new(mockLinkToken.address, mockOracle.address, url, path);
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

  describe("Test creatHangmanContact", async () => {
    it("Test createHangmanContract does not return empty address", async() => {
        let startGame = await StartGame.new();
        let address = await startGame.createHangmanContract.call();
        assert.notEqual(address, EMPTY_ADDRESS, "address is not the null address");
    });
    
    it("Test owner of deployed contact", async() => {
        let startGame = await StartGame.new();
        let requestId = await startGame.requestStartGame.call();

        console.log(requestId);

        let trx = await startGame.requestStartGame();;

        //let hangmanContract = await Hangman.at(address);
        //let isOwner = await hangmanContract.isOwner.call();
        //assert.equal(isOwner, true, "Is owner should be true");
    });
  });
});
