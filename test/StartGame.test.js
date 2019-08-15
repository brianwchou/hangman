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
      await helper.revertToSnapShot(snapshotId);
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
    it("Test requestStartGame is successful in requesting to start a game", async() => {
        let trx = await startGame.requestStartGame(1);

        //listen for event and capture the requestId
        let requestId
        truffleAssert.eventEmitted(trx, 'RequestGame', (e) => {
            //capture requestId
            requestId = e.requestId;
            return e.owner === player;
        }); 

        let game = await startGame.requestIdToGame(requestId);
        assert.equal(game[0], player, "saving game instance was unsuccessful");
        assert.equal(game[1], EMPTY_ADDRESS, "saving game instance was unsuccessful");

        // NOTE: at this point the user would be waiting for the oracle to call the contract back
    });
    
    it("Test fullfillStartGame is successful in creating a Hangman contract", async() => {
        let trx = await startGame.requestStartGame(1);

        //listen for event and capture the requestId
        let requestId
        truffleAssert.eventEmitted(trx, 'RequestGame', (e) => {
            //capture requestId
            requestId = e.requestId;
            return e.owner === player;
        }); 

        // NOTE: at this point the user would be waiting for the oracle to call the contract back
      
        //call the fullfillStartGame with data that mocks
        let givenWord = "testing";
        let bytesVal = web3.fromAscii(givenWord);
        trx = await startGame.fullfillStartGame(requestId, bytesVal, { from: mockOracle });

        //listen for event and capture new game
        truffleAssert.eventEmitted(trx, 'ReceiveGame', (e) => {
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
