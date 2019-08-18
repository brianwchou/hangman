const StartGame = artifacts.require("HangmanFactory");
const Hangman = artifacts.require("Hangman");
const MockContract = artifacts.require("MockContract");
const Oracle = artifacts.require("Oracle");
const LinkToken = artifacts.require("LinkToken");
const helper = require('ganache-time-traveler');
const truffleAssert = require('truffle-assertions');
const utils = require('./utils.js');
const web3 = utils.getWeb3();

const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';
const CHAINLINK_HTTP_GET_JOB_ID = "013f25963613411badc2ece3a92d0800"; //this is mainnet jobid
const PAYMENT = 1;

contract('StartGame', async (accounts) => {
  let startGame;
  let mockLinkToken;
  let mockOracle = accounts[9];
  let player = accounts[0];
  let url = "https://en.wikipedia.org/api/rest_v1/page/random/title";
  let path = "items[0].title";
  let snapshotId;

  before('deploy StartGame', async() => {
      let linkTokenTemplate = await LinkToken.new();
      mockLinkToken = await MockContract.new();

      //mock LinkToken.transferAndCall()
      let mockLink_transferAndCall = 
        linkTokenTemplate.contract.methods
          .transferAndCall(EMPTY_ADDRESS, 0, web3.fromAscii("0"))
          .encodeABI();
      await mockLinkToken.givenMethodReturnBool(mockLink_transferAndCall, true);

      startGame = await StartGame.new(mockLinkToken.address, mockOracle, url, path);
  });

  beforeEach(async() => {
    let snapShot = await helper.takeSnapshot();
    snapshotId = snapShot['result'];
  });

  afterEach(async() => {
      await helper.revertToSnapshot(snapshotId);
  });

  describe("Test initial values", async () => {
    it("Test url", async() => {
        let val = await startGame.url.call();
        assert.equal(val, url, "url not properly set");
    })
    
    it("Test path", async() => {
        let val = await startGame.path.call();
        assert.equal(val, path, "path not properly set");
    })
  });

  describe("Test creation of hangman contract game", async () => {
    it("Test requestCreateGame is successful in requesting to start a game", async() => {
        let trx = await startGame.requestCreateGame(web3.fromAscii(CHAINLINK_HTTP_GET_JOB_ID), PAYMENT);

        //listen for event and capture the requestId
        let requestId
        truffleAssert.eventEmitted(trx, 'RequestCreateGame', (e) => {
            //capture requestId
            requestId = e.requestId;
            return e.owner === player;
        }); 

        let game = await startGame.requestIdToGame(requestId);
        assert.equal(game[0], player, "saving game instance was unsuccessful");
        assert.equal(game[1], EMPTY_ADDRESS, "saving game instance was unsuccessful");

        // NOTE: at this point the user would be waiting for the oracle to call the contract back
    });
    
    it("Test fullfillCreateGame is successful in creating a Hangman contract", async() => {
        let trx = await startGame.requestCreateGame(web3.fromAscii(CHAINLINK_HTTP_GET_JOB_ID), PAYMENT);

        //listen for event and capture the requestId
        let requestId
        truffleAssert.eventEmitted(trx, 'RequestCreateGame', (e) => {
            //capture requestId
            requestId = e.requestId;
            return e.owner === player;
        }); 

        // NOTE: at this point the user would be waiting for the oracle to call the contract back
      
        //call the fullfillCreateGame with data that mocks
        let givenWord = "testing";
        let bytesVal = web3.fromAscii(givenWord);
        trx = await startGame.fullfillCreateGame(requestId, bytesVal, { from: mockOracle });

        //listen for event and capture new game
        truffleAssert.eventEmitted(trx, 'FulfillCreateGame', (e) => {
            return e.owner === player && e.requestId === requestId;
        }); 

        let game = await startGame.requestIdToGame(requestId);
        assert.equal(game[0], player, "saving game instance was unsuccessful");
        assert.isOk(game[1], "saving game instance was unsuccessful");

        let hangman = await Hangman.at(game[1]);
        let owner = await hangman.owner.call();
        assert.equal(owner, player, "player is not the owner of hangman contract");

        trx = await hangman.makeWordGuess(web3.fromAscii("testing"));
        truffleAssert.eventEmitted(trx, "GameWin");
    });
  });
});
