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
            await truffleAssert.passes(
              hangmanContract.makeCharGuess(web3.utils.fromAscii("e")),
              "Transaction failed");
            var input = await hangmanContract.playerInput.call();
            assert.equal(input.toNumber(), 2, "expected value is incorrect");
        });

        it("Test make chracter guess with l", async () => {
            await truffleAssert.passes(
              hangmanContract.makeCharGuess(web3.utils.fromAscii("l")),
              "Transaction failed");
            var input = await hangmanContract.playerInput.call();
            assert.equal(input.toNumber(), 12, "expected value is incorrect");
        });
    });

    describe("Test make word guess", async () => {

        it("Test that currentGuesses increases by 1", async () => {
            await truffleAssert.passes(
              hangmanContract.makeWordGuess(web3.utils.fromAscii("world")),
              "Transaction failed");
            var input = await hangmanContract.currentGuesses.call();
            assert.equal(input.toNumber(), 1, `currentGuesses should be 1 not ${input.toNumber()}`);
        });

        it("Test correct word", async () => {
            await truffleAssert.passes(
              hangmanContract.makeWordGuess(web3.utils.fromAscii("hello")),
              "Transaction failed");

            // truffleAssert.eventEmitted(tx, 'Play', (ev) => {
            //     return ev.player === bettingAccount && !ev.betNumber.eq(ev.winningNumber);
            // });

        });
    });

    describe.only("Test used characters", async () => {
        it("Test make duplicated character guess", async () => {
            await truffleAssert.passes(
              hangmanContract.makeCharGuess(web3.utils.fromAscii("e")),
              "Transaction failed");
            await truffleAssert.reverts(
              hangmanContract.makeCharGuess(web3.utils.fromAscii("e")),
              "character has aleady been guessed");
        });

        it("Test get used characters", async () => {
            await truffleAssert.passes(
                hangmanContract.makeCharGuess(web3.utils.fromAscii("e")),
                "Transaction failed");
            await truffleAssert.passes(
                hangmanContract.makeCharGuess(web3.utils.fromAscii("l")),
                "Transaction failed");

            let usedCharacters = await hangmanContract.getUsedCharacters.call();
            assert.equal(web3.utils.hexToAscii(usedCharacters[0]), "e", "expected value not matched")
            assert.equal(web3.utils.hexToAscii(usedCharacters[1]), "l", "expected value not matched")
        });

    });

    describe('Test getCorrectlyGuessedCharacters', async () => {

        it("Test getCorrectlyGuessedCharacters retrives correctly when letter l is guessed", async () => {
            let tx = await hangmanContract.makeCharGuess(web3.utils.fromAscii("l"));
            truffleAssert.passes(tx, "Transaction failed");
            let guessedCharacters = await hangmanContract.getCorrectlyGuessedCharacters();

            assert.equal(web3.utils.hexToAscii(guessedCharacters[2]), "l", `guessed character at index 2 is ${guessedCharacters[2]} and not l`);
            assert.equal(web3.utils.hexToAscii(guessedCharacters[3]), "l", `guessed character at index 3 is ${guessedCharacters[3]} and not l`);
        });

    }); 
});
});
