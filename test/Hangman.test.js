var Hangman = artifacts.require("Hangman");
const helper = require('./utils.js');
const truffleAssert = require('truffle-assertions');
var web3 = helper.getWeb3();

contract('Hangman', async (accounts) => {

    const player = accounts[0];
    var hangmanContract;

    before(async() => {
        hangmanContract = await Hangman.new(web3.fromAscii("hello"), 5);
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
            assert.equal(playerAddress, player, "playerAddress dont match");
        });
        
        it("check maxAllowedMisses", async () => {
            let maxAllowedMisses = await hangmanContract.maxAllowedMisses.call();
            assert.equal(maxAllowedMisses.toNumber(), 5, "maxAllowedMisses dont match");
        });

        it("check currentMisses", async () => {
            let currentMisses = await hangmanContract.currentMisses.call();
            assert.equal(currentMisses.toNumber(), 0, "currentMisses dont match");
        });

        it("check playerInput", async () => {
            let playerInput = await hangmanContract.playerInput.call();
            assert.equal(playerInput.toNumber(), 0, "playerInput dont match");
        });

        it("check usedCharacters", async () => {
            let usedChars = await hangmanContract.getUsedCharacters.call();
            assert.equal(usedChars.length, 0, "there should be no used characters");
        });
    });

    describe("Test playerInput return values", async() => {
        it("Test make chracter guess example 1", async () => {
            await truffleAssert.passes(
              hangmanContract.makeCharGuess(web3.fromAscii("e")),
              "Transaction failed");
            var input = await hangmanContract.playerInput.call();
            assert.equal(input.toNumber(), 2, "expected value is incorrect");
        });

        it("Test make chracter guess example 2", async () => {
            await truffleAssert.passes(
              hangmanContract.makeCharGuess(web3.fromAscii("l")),
              "Transaction failed");
            var input = await hangmanContract.playerInput.call();
            assert.equal(input.toNumber(), 12, "expected value is incorrect");
        });
    });

    describe("Test make character guess", async () => {
        it("Test make character guess valid", async () => {
            await truffleAssert.passes(
              hangmanContract.makeCharGuess(web3.fromAscii("e")),
              "Transaction failed");
            var input = await hangmanContract.playerInput.call();
            assert.equal(input.toNumber(), 2, "expected value is incorrect");
        });

        it("Test make character guess invalid", async () => {
            await truffleAssert.passes(
              hangmanContract.makeCharGuess(web3.fromAscii("e")),
              "Transaction failed");
            await truffleAssert.reverts(
              hangmanContract.makeCharGuess(web3.fromAscii("e")),
              "character has aleady been guessed");
        });

        it("Test make character guess events", async () => {
            let tx = await hangmanContract.makeCharGuess(web3.fromAscii("l"));
            await truffleAssert.eventEmitted(tx, 'TurnTaken');
        });
    });

    describe("Test make word guess", async () => {
        it("Test that currentMisses increases by 1", async () => {
            await truffleAssert.passes(
              hangmanContract.makeWordGuess(web3.fromAscii("world")),
              "Transaction failed");
            var input = await hangmanContract.currentMisses.call();
            assert.equal(input.toNumber(), 1, `currentMisses should be 1 not ${input.toNumber()}`);
        });

        it("Test correct word", async () => {
            await truffleAssert.passes(
              hangmanContract.makeWordGuess(web3.fromAscii("hello")),
              "Transaction failed");
        });

        it("Test make word guess events turn", async () => {
            let tx = await hangmanContract.makeWordGuess(web3.fromAscii("testing"));
            await truffleAssert.eventEmitted(tx, 'TurnTaken');
        });

        it("Test make word guess events win", async () => {
            let tx = await hangmanContract.makeWordGuess(web3.fromAscii("hello"));
            await truffleAssert.eventEmitted(tx, 'GameWin');
        });
    });

    describe("Test used characters", async () => {
        it("Test get used characters", async () => {
            await truffleAssert.passes(
                hangmanContract.makeCharGuess(web3.fromAscii("e")),
                "Transaction failed");
            await truffleAssert.passes(
                hangmanContract.makeCharGuess(web3.fromAscii("l")),
                "Transaction failed");

            let usedCharacters = await hangmanContract.getUsedCharacters.call();
            assert.equal(web3.toAscii(usedCharacters[0]), "e", "expected value not matched")
            assert.equal(web3.toAscii(usedCharacters[1]), "l", "expected value not matched")
        });
    });

    describe('Test getCorrectlyGuessedCharacters', async () => {
        it("Test getCorrectlyGuessedCharacters retrives correctly when letter l is guessed", async () => {
            let tx = await hangmanContract.makeCharGuess(web3.fromAscii("l"));
            truffleAssert.passes(tx, "Transaction failed");
            let guessedCharacters = await hangmanContract.getCorrectlyGuessedCharacters();

            assert.equal(web3.toAscii(guessedCharacters[0]), "\0", `guessed character at index 0 is ${guessedCharacters[0]} and not null`);
            assert.equal(web3.toAscii(guessedCharacters[1]), "\0", `guessed character at index 1 is ${guessedCharacters[1]} and not null`);
            assert.equal(web3.toAscii(guessedCharacters[2]), "l", `guessed character at index 2 is ${guessedCharacters[2]} and not l`);
            assert.equal(web3.toAscii(guessedCharacters[3]), "l", `guessed character at index 3 is ${guessedCharacters[3]} and not l`);
            assert.equal(web3.toAscii(guessedCharacters[4]), "\0", `guessed character at index 3 is ${guessedCharacters[4]} and not null`);
        });
    }); 
});
