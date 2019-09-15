const HangmanFactory = artifacts.require("HangmanFactory");
const Hangman = artifacts.require("Hangman");
const Oracle = artifacts.require("Oracle");
const LinkToken = artifacts.require("LinkToken");
const truffleAssert = require('truffle-assertions');
const utils = require('./utils.js');
const web3 = utils.getWeb3();
const BigNumber = require('bignumber.js');

const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';
const url = "https://en.wikipedia.org/api/rest_v1/page/random/title";
const path = "items[0].title";

//ROPSTEN TESTNET ADDRESS
const chainlinkTokenAddress = "0x20fE562d797A42Dcb3399062AE9546cd06f63280";
const chainlinkOracleAddress = "0xc99B3D447826532722E41bc36e644ba3479E4365";
const CHAINLINK_HTTP_GET_JOB_ID = "96bf1a27492142b095a8ada21631ebd0"; //this is the testnet jobid
const PAYMENT = 1;

contract('Hangman Integration Tests', async (accounts) => {
  let hangmanFactory;
  let requestId;
  let player = accounts[0]; //TODO: does this access the actual account?
  //probably need to use truffle-hdwallet-provider

  before('deploy HangmanFactory', async() => {
//      hangmanFactory = await HangmanFactory.new(
//        chainlinkTokenAddress,
//        chainlinkOracleAddress,
//        url,
//        path
//      );
      hangmanFactory = await HangmanFactory.at("0x4d1d55e1f916d388ae5d236610dbf7c3c58d05a6");
      //transfer link to hangman factory address at the value it's going to use
      console.log("HangmanFactory Address: " + hangmanFactory.address)
  });

  describe("Test initial values", async () => {
    it("Test url", async() => {
        let val = await hangmanFactory.url.call();
        assert.equal(val, url, "url not properly set");
    })
    
    it("Test path", async() => {
        let val = await hangmanFactory.path.call();
        assert.equal(val, path, "path not properly set");
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

        let trx = await hangmanFactory.requestCreateGame(web3.fromAscii(CHAINLINK_HTTP_GET_JOB_ID), paymentAmount);

        //listen for event and capture the requestId
        truffleAssert.eventEmitted(trx, 'RequestCreateGame', (e) => {
            //capture requestId
            requestId = e.requestId;
            return e.owner === player;
        }); 

        console.log("Request ID: " + requestId)

        let game = await hangmanFactory.requestIdToGame.call(requestId);
        assert.equal(game[0], player, "saving game instance was unsuccessful");
        assert.equal(game[1], EMPTY_ADDRESS, "saving game instance was unsuccessful");

        // NOTE: at this point the user would be waiting for the oracle to call the contract back
    });
    
    it("Test fullfillCreateGame is successful in creating a Hangman contract", async() => {
        //listen for event and capture new game OR poll the contract with requestId

        let game = await hangmanFactory.requestIdToGame(requestId);
        //wait until the game has been created
        //either listen for the event or poll...
        while(game[1] == EMPTY_ADDRESS) {
          console.log("no hangman address requesting again")
          game = await hangmanFactory.requestIdToGame(requestId)
          console.log(game[0])
          console.log(game[1])
        }
        assert.equal(game[0], player, "saving game instance was unsuccessful");
        assert.notStrictEqual(game[1], EMPTY_ADDRESS, "saving game instance was unsuccessful");
    });

    it("Test then Hangman Game that is created", async () => {
        let hangman = await Hangman.at(game[1]);
        let owner = await hangman.owner.call();
        assert.equal(owner, player, "player is not the owner of hangman contract");

        trx = await hangman.makeWordGuess(web3.fromAscii("testing"));

        //TODO: add methods that call methods from the contract
        //assert that a vowel can be found
    });
  });
});
