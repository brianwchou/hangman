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
        it("check owner of contract", async () => {
            let owner = await hangmanContract.owner.call();
            assert.equal(owner, player, "owner doesnt match");
        });
        
        it("check maxAllowedMisses", async () => {
            let maxAllowedMisses = await hangmanContract.maxAllowedMisses.call();
            assert.equal(maxAllowedMisses.toNumber(), 5, "maxAllowedMisses doesnt match");
        });

        it("check currentMisses", async () => {
            let currentMisses = await hangmanContract.currentMisses.call();
            assert.equal(currentMisses.toNumber(), 0, "currentMisses doesnt match");
        });

        it("check playerInput", async () => {
            let playerInput = await hangmanContract.playerInput.call();
            assert.equal(playerInput.toNumber(), 0, "playerInput doesnt match");
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

        it("Test make chracter guess example 3", async () => {
            await truffleAssert.passes(
              hangmanContract.makeCharGuess(web3.fromAscii("h")),
              "Transaction failed");
            var input = await hangmanContract.playerInput.call();
            assert.equal(input.toNumber(), 1, "expected value is incorrect");
        });

        it("Test make chracter guess example o", async () => {
            await truffleAssert.passes(
              hangmanContract.makeCharGuess(web3.fromAscii("o")),
              "Transaction failed");
            var input = await hangmanContract.playerInput.call();
            assert.equal(input.toNumber(), 16, "expected value is incorrect");
        });
    });

    describe("Test make character guess", async () => {
        it("Test make character guess with unknown char", async () => {
            await truffleAssert.passes(
              hangmanContract.makeCharGuess(web3.fromAscii("e")),
              "Transaction failed");
            var input = await hangmanContract.playerInput.call();
            assert.equal(input.toNumber(), 2, "expected value is incorrect");
        });

        it("Test make character guess with known char", async () => {
            await truffleAssert.passes(
              hangmanContract.makeCharGuess(web3.fromAscii("e")),
              "Transaction failed");
            await truffleAssert.reverts(
              hangmanContract.makeCharGuess(web3.fromAscii("e")),
              "character has aleady been guessed");
        });

        it("Test make character guess incorrect char", async () => {
            await hangmanContract.makeCharGuess(web3.fromAscii("p"));
            let misses = await hangmanContract.currentMisses.call();
            assert.equal(misses.toNumber(), 1, "current misses should have increased");
        });

        it("Test make character guess correct char", async () => {
            await hangmanContract.makeCharGuess(web3.fromAscii("h"));
            let misses = await hangmanContract.currentMisses.call();
            assert.equal(misses.toNumber(), 0, "current misses should not have increased");
        });

        it("Test make character guess turn event", async () => {
            let tx = await hangmanContract.makeCharGuess(web3.fromAscii("l"));
            await truffleAssert.eventEmitted(tx, 'TurnTaken');
        });

        it("Test make character game lose", async () => {
            await hangmanContract.makeCharGuess(web3.fromAscii("a"));
            await hangmanContract.makeCharGuess(web3.fromAscii("b"));
            await hangmanContract.makeCharGuess(web3.fromAscii("c"));
            await hangmanContract.makeCharGuess(web3.fromAscii("d"));
            let tx = await hangmanContract.makeCharGuess(web3.fromAscii("f"));
            await truffleAssert.eventEmitted(tx, 'GameLose');
        });

        it("Test make character game win", async () => {
            await hangmanContract.makeCharGuess(web3.fromAscii("h"));
            await hangmanContract.makeCharGuess(web3.fromAscii("e"));
            await hangmanContract.makeCharGuess(web3.fromAscii("l"));
            let tx = await hangmanContract.makeCharGuess(web3.fromAscii("o"));
            await truffleAssert.eventEmitted(tx, 'GameWin');
        });
    });

    describe("Test make word guess", async () => {
        it("Test make word guess incorrect word", async () => {
            await truffleAssert.passes(
              hangmanContract.makeWordGuess(web3.fromAscii("world")),
              "Transaction failed");
            var input = await hangmanContract.currentMisses.call();
            assert.equal(input.toNumber(), 1, "current misses should have increased");
        });

        it("Test make word guess correct word", async () => {
            await truffleAssert.passes(
              hangmanContract.makeWordGuess(web3.fromAscii("hello")),
              "Transaction failed");

            let misses = await hangmanContract.currentMisses.call();
            assert.equal(misses.toNumber(), 0, "current misses should not have increased");
        });

        it("Test make word guess turn event", async () => {
            let tx = await hangmanContract.makeWordGuess(web3.fromAscii("testing"));
            await truffleAssert.eventEmitted(tx, 'TurnTaken');
        });

        it("Test make word guess game win", async () => {
            let tx = await hangmanContract.makeWordGuess(web3.fromAscii("hello"));
            await truffleAssert.eventEmitted(tx, 'GameWin');
        });

        it("Test make word guess game lose", async () => {
            await hangmanContract.makeWordGuess(web3.fromAscii("testing"));
            await hangmanContract.makeWordGuess(web3.fromAscii("testing"));
            await hangmanContract.makeWordGuess(web3.fromAscii("testing"));
            await hangmanContract.makeWordGuess(web3.fromAscii("testing"));
            let tx = await hangmanContract.makeWordGuess(web3.fromAscii("testing"));
            await truffleAssert.eventEmitted(tx, 'GameLose');
        });
    });

    describe("Test make char and make word combined", async () => {
        it("Test make char guess then incorrect word guess", async () => {
            await truffleAssert.passes(
              hangmanContract.makeCharGuess(web3.fromAscii("e")),
              "Transaction failed");

            await truffleAssert.passes(
              hangmanContract.makeWordGuess(web3.fromAscii("world")),
              "Transaction failed");

            var input = await hangmanContract.currentMisses.call();
            assert.equal(input.toNumber(), 1, "current misses should have increased");
        });

        it("Test make char guess then correct word guess", async () => {
            await truffleAssert.passes(
              hangmanContract.makeCharGuess(web3.fromAscii("e")),
              "Transaction failed");

            await truffleAssert.passes(
              hangmanContract.makeWordGuess(web3.fromAscii("hello")),
              "Transaction failed");

            var input = await hangmanContract.currentMisses.call();
            assert.equal(input.toNumber(), 0, "current misses should not have increased");
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
            assert.equal(usedCharacters.length, 2, "used character count is incorrect")
            assert.equal(web3.toAscii(usedCharacters[0]), "e", "expected value not matched")
            assert.equal(web3.toAscii(usedCharacters[1]), "l", "expected value not matched")
        });
    });

    describe('Test characters that have been unveiled', async () => {
        it("Test getting correctly guessed characters", async () => {
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

    describe("Test game over", async () => {
        it("Test game over and guess char", async () => {
            await truffleAssert.passes(
                hangmanContract.makeWordGuess(web3.fromAscii("hello")),
                "Transaction failed");

            await truffleAssert.reverts(
                hangmanContract.makeCharGuess(web3.fromAscii("p")),
                "solution is found");
        });

        it("Test game over and guess word", async () => {
            await truffleAssert.passes(
                hangmanContract.makeWordGuess(web3.fromAscii("hello")),
                "Transaction failed");

            await truffleAssert.reverts(
                hangmanContract.makeWordGuess(web3.fromAscii("testing")),
                "solution is found");
        });
    });
});
