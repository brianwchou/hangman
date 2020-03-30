const HangmanFactory = artifacts.require("HangmanFactory");
const Hangman = artifacts.require("Hangman");
const Oracle = artifacts.require("Oracle");
const LinkToken = artifacts.require("LinkToken");
const truffleAssert = require('truffle-assertions');
const ethers = require('ethers');
const BigNumber = require('bignumber.js');
const delay = m => new Promise(r => setTimeout(r, m));
const {
  EMPTY_ADDRESS,
  url,
  path,
  chainlinkTokenAddress,
  chainlinkOracleAddress,
  CHAINLINK_HTTP_GET_JSON_PARSE_JOB_ID,
  PAYMENT
} = require('./constants')

contract('Hangman Integration Tests', async (accounts) => {
  let hangmanFactory;
  let requestId;
  let player = accounts[0];
  //probably need to use truffle-hdwallet-provider

  before('deploy HangmanFactory', async() => {
        hangmanFactory = await HangmanFactory.new(
          chainlinkTokenAddress,
          chainlinkOracleAddress,
          url,
          path
        );
      //hangmanFactory = await HangmanFactory.at("0xd723d7DE8C0811484dF4FBfa174555a2BCBF8aBA");
      //transfer link to hangman factory address at the value it's going to use
      console.log("HangmanFactory Address: " + hangmanFactory.address)
  });

  describe("Test initial values", async () => {
    it("Test url", async() => {
        let val = await hangmanFactory.url.call();
        assert.equal(val, url, "url not properly set");
    })
    
    it("Test path", async() => {
        let val_0 = await hangmanFactory.path.call(0);
        assert.equal(val_0, path[0], "path not properly set");
        let val_1 = await hangmanFactory.path.call(1);
        assert.equal(val_1, path[1], "path not properly set");
        let val_2 = await hangmanFactory.path.call(2);
        assert.equal(val_2, path[2], "path not properly set");
    })

    it("Test LinkToken", async() => {
        let val = await hangmanFactory.linkToken.call();
        assert.equal(val, chainlinkTokenAddress, "token not properly set");
    })

    it("Test Oracle", async() => {
        let val = await hangmanFactory.oracle.call();
        assert.equal(val, chainlinkOracleAddress, "oracle not properly set");
    })
  });

  describe("Test factory and hangman game", async () => {
    it("Test requestCreateGame is successful in requesting to start a game", async() => {
        
        //give approval to factory
        let token = await LinkToken.at(chainlinkTokenAddress);
        let decimals = (await token.decimals.call()).toNumber();
        let paymentAmount = new BigNumber(PAYMENT * Math.pow(10, decimals));
        await token.approve(hangmanFactory.address, paymentAmount);

        let trx = await hangmanFactory.requestCreateGame(ethers.utils.toUtf8Bytes(CHAINLINK_HTTP_GET_JSON_PARSE_JOB_ID), paymentAmount);

        //listen for event and capture the requestId
        truffleAssert.eventEmitted(trx, 'RequestCreateGame', (e) => {
            //capture requestId
            requestId = e.requestId;
            return e.owner === player;
        }); 

        console.log("Request ID: " + requestId)

        let game = await hangmanFactory.requestIdToGame.call(requestId);
        assert.equal(game[0], player, "saving game instance was unsuccessful");
        assert.notEqual(game[1], EMPTY_ADDRESS, "saving game instance was unsuccessful");

        // NOTE: at this point the user would be waiting for the oracle to call the contract back
    });
    
    it("Test oracle callback fullfillCreateGame", async() => {
        //listen for event and capture new game OR poll the contract with requestId

        let game = await hangmanFactory.requestIdToGame(requestId);
        //wait until the game has been created
        //either listen for the event or poll...
        // get game instance
        let hangman = await Hangman.at(game[1]);
        let owner = await hangman.owner.call();

        const now = Date.now();
        while(owner !== player) {
          console.log("waiting on change of owner")
          owner = await hangman.owner.call();
          console.log("Current Owner: " + owner)
          console.log("Expected Owner: " + player)
          await delay(10000); // create a 10 second delay here so we dont over load the network?
        }
        const later = Date.now()
        const diff = Math.abs(now - later);
        console.log(`polling time: ${diff / 1000} seconds`);

        assert.equal(owner, player, "player is not the owner of hangman contract");
    });

    it("Test the Hangman Game is playable and the correct solution has been set", async () => {
        let game = await hangmanFactory.requestIdToGame(requestId);
        let hangman = await Hangman.at(game[1]);
        trx = await hangman.makeWordGuess(ethers.utils.toUtf8Bytes("Investing"));
        truffleAssert.eventEmitted(trx, 'GameWin'); 
    });
  });
});
