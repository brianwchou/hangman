var Hangman = artifacts.require("Hangman");
const helper = require('./utils.js');
const truffleAssert = require('truffle-assertions');

contract('Hangman', async (accounts) => {

    var hangmanContract;

    before(async() => {
        hangmanContract = await Hangman.new(web3.utils.fromAscii("hello"), 5);
    });

    beforeEach(async() => {
        snapShot = await helper.takeSnapshot();
        snapshotId = snapShot['result'];
    });

    afterEach(async() => {
        await helper.revertToSnapShot(snapshotId);
    });

    describe("check initial state of contract", async () => {
        
        it("check player address", async () => {
            let playerAddress = await hangmanContract.playerAddress.call();

            assert.equal(playerAddress, accounts[0], "playerAddress dont match");
        });
        
        it("check maxGuesses", async () => {
            let maxGuesses = await hangmanContract.maxGuesses.call();

            assert.equal(maxGuesses.toNumber(), 5, "maxGuesses dont match");
        });

        it("check currentGuesses", async () => {
            let currentGuesses = await hangmanContract.currentGuesses.call();

            assert.equal(currentGuesses.toNumber(), 0, "currentGuesses dont match");
        });

        it("check playerInput", async () => {
            let playerInput = await hangmanContract.playerInput.call();

            assert.equal(playerInput.toNumber(), 0, "playerInput dont match");
        });
    });

    describe("Test make charcter guess", async () => {

        it("Test make chracter guess with e", async () => {
            let tx = await hangmanContract.makeCharGuess(web3.utils.fromAscii("e"));
            truffleAssert.passes(tx, "Transaction failed");
            var input = await hangmanContract.playerInput.call();
            assert.equal(input.toNumber(), 2, "expected value is incorrect");
        });

        it("Test make chracter guess with l", async () => {
            let tx = await hangmanContract.makeCharGuess(web3.utils.fromAscii("l"));
            truffleAssert.passes(tx, "Transaction failed");
            var input = await hangmanContract.playerInput.call();
            assert.equal(input.toNumber(), 12, "expected value is incorrect");
        });
    });

    describe.only("Test make word guess", async () => {

        it("Test that currentGuesses increases by 1", async () => {
            let tx = await hangmanContract.makeWordGuess(web3.utils.fromAscii("world"));
            truffleAssert.passes(tx, "Transaction failed");
            var input = await hangmanContract.currentGuesses.call();
            assert.equal(input.toNumber(), 1, `currentGuesses should be 1 not ${input.toNumber()}`);
        });

        it("Test correct word", async () => {
            let tx = await hangmanContract.makeWordGuess(web3.utils.fromAscii("hello"));
            truffleAssert.passes(tx, "Transaction failed");

            // truffleAssert.eventEmitted(tx, 'Play', (ev) => {
            //     return ev.player === bettingAccount && !ev.betNumber.eq(ev.winningNumber);
            // });

        });
    });


    
    
});
