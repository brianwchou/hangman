const Hangman = artifacts.require("Hangman");
const helper = require('ganache-time-traveler');
const truffleAssert = require('truffle-assertions');
const ethers = require('ethers');

contract('Hangman', async (accounts) => {
    const player = accounts[0];
    const notPlayer = accounts[1];
    var hangmanContract;
    let snapshotId;

    beforeEach(async() => {
        let snapShot = await helper.takeSnapshot();
        snapshotId = snapShot['result'];
    });

    afterEach(async() => {
        await helper.revertToSnapshot(snapshotId);
    });

    before(async() => {
        hangmanContract = await Hangman.new();
    });

    describe("Test game with no solution set", async () => {
        it("check that only owner can set solution", async() => {
            await truffleAssert.reverts(hangmanContract.setSolution(ethers.utils.toUtf8Bytes("hello"), 5, { from: notPlayer }));
        });

        it("check solution can be set if there is no solution", async() => {
            await truffleAssert.passes(hangmanContract.setSolution(ethers.utils.toUtf8Bytes("hello"), 5), "should be able to set solution");
        });

        it("check usedCharacters", async () => {
            await truffleAssert.passes(hangmanContract.getUsedCharacters.call());
        });

        it("check makeCharGuess", async () => {
            await truffleAssert.reverts(hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("e")), "solution not set");
        });

        it("check makeWordGuess", async () => {
            await truffleAssert.reverts(hangmanContract.makeWordGuess(ethers.utils.toUtf8Bytes("world")), "solution not set")
        });

        it("check getNumberOfCharacters", async () => {
            await truffleAssert.passes(hangmanContract.getNumberOfCharacters.call());
        });

        it("check getCorrectlyGuessedCharacters", async () => {
            await truffleAssert.passes(hangmanContract.getCorrectlyGuessedCharacters.call());
        });
    })

    describe("Test game with solution set", async() => {
      before(async() => {
          await hangmanContract.setSolution(ethers.utils.toUtf8Bytes("hello"), 5);
      })

      describe("Test initial state of contract with solution", async () => {
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
          it("Test makeCharGuess example 1", async () => {
              await truffleAssert.passes(
                hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("e")),
                "Transaction failed");
              var input = await hangmanContract.playerInput.call();
              assert.equal(input.toNumber(), 2, "expected value is incorrect");
          });

          it("Test makeCharGuess example 2", async () => {
              await truffleAssert.passes(
                hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("l")),
                "Transaction failed");
              var input = await hangmanContract.playerInput.call();
              assert.equal(input.toNumber(), 12, "expected value is incorrect");
          });

          it("Test makeCharGuess example 3", async () => {
              await truffleAssert.passes(
                hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("h")),
                "Transaction failed");
              var input = await hangmanContract.playerInput.call();
              assert.equal(input.toNumber(), 1, "expected value is incorrect");
          });

          it("Test makeCharGuess example o", async () => {
              await truffleAssert.passes(
                hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("o")),
                "Transaction failed");
              var input = await hangmanContract.playerInput.call();
              assert.equal(input.toNumber(), 16, "expected value is incorrect");
          });
      });

      describe("Test makeCharGuess", async () => {
          it("Test makeCharGuess with unknown char", async () => {
            let tx = await hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("e"))
            await truffleAssert.eventEmitted(tx, 'TurnTaken', {isValidInput: true});

            var input = await hangmanContract.playerInput.call();
            assert.equal(input.toNumber(), 2, "expected value is incorrect");
          });

          it("Test 2 calls to makeCharGuess with same char", async () => {
            let tx = await hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("e"))
            await truffleAssert.eventEmitted(tx, 'TurnTaken', {isValidInput: true});

            tx = await hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("e"))
            await truffleAssert.eventEmitted(tx, 'TurnTaken', {isValidInput: false});
          });

          it("Test makeCharGuess with not owner", async () => {
              await truffleAssert.reverts(hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("e"), { from: notPlayer }));
          })

          it("Test makeCharGuess incorrect char", async () => {
              await hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("p"));
              let misses = await hangmanContract.currentMisses.call();
              assert.equal(misses.toNumber(), 1, "current misses should have increased");
          });

          it("Test makeCharGuess correct char", async () => {
              await hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("h"));
              let misses = await hangmanContract.currentMisses.call();
              assert.equal(misses.toNumber(), 0, "current misses should not have increased");
          });

          it("Test makeCharGuess emit GameLose", async () => {
              await hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("a"));
              await hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("b"));
              await hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("c"));
              await hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("d"));
              let tx = await hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("f"));
              await truffleAssert.eventEmitted(tx, 'GameLose');
          });

          it("Test makeCharGuess emit GameWin", async () => {
              await hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("h"));
              await hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("e"));
              await hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("l"));
              let tx = await hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("o"));
              await truffleAssert.eventEmitted(tx, 'GameWin');
          });
      });

      describe("Test makeWordGuess", async () => {
          it("Test makeWordGuess incorrect word", async () => {
              await truffleAssert.passes(
                hangmanContract.makeWordGuess(ethers.utils.toUtf8Bytes("world")),
                "Transaction failed");
              var input = await hangmanContract.currentMisses.call();
              assert.equal(input.toNumber(), 1, "current misses should have increased");
          });

          it("Test makeWordGuess correct word", async () => {
              await truffleAssert.passes(
                hangmanContract.makeWordGuess(ethers.utils.toUtf8Bytes("hello")),
                "Transaction failed");

              let misses = await hangmanContract.currentMisses.call();
              assert.equal(misses.toNumber(), 0, "current misses should not have increased");
          });

          it("Test makeWordGuess with not owner", async () => {
              await truffleAssert.reverts(
                hangmanContract.makeWordGuess(ethers.utils.toUtf8Bytes("hello"), { from: notPlayer }))
          })

          it("Test makeWordGuess TurnTaken", async () => {
              let tx = await hangmanContract.makeWordGuess(ethers.utils.toUtf8Bytes("testing"));
              await truffleAssert.eventEmitted(tx, 'TurnTaken');
          });

          it("Test makeWordGuess emits GameWin", async () => {
              let tx = await hangmanContract.makeWordGuess(ethers.utils.toUtf8Bytes("hello"));
              await truffleAssert.eventEmitted(tx, 'GameWin');
          });

          it("Test makeWordGuess emits GameLose", async () => {
              await hangmanContract.makeWordGuess(ethers.utils.toUtf8Bytes("testing"));
              await hangmanContract.makeWordGuess(ethers.utils.toUtf8Bytes("testing"));
              await hangmanContract.makeWordGuess(ethers.utils.toUtf8Bytes("testing"));
              await hangmanContract.makeWordGuess(ethers.utils.toUtf8Bytes("testing"));
              let tx = await hangmanContract.makeWordGuess(ethers.utils.toUtf8Bytes("testing"));
              await truffleAssert.eventEmitted(tx, 'GameLose');
          });
      });

      describe("Test make char and make word combined", async () => {
          it("Test make char guess then incorrect word guess", async () => {
              await truffleAssert.passes(
                hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("e")),
                "Transaction failed");

              await truffleAssert.passes(
                hangmanContract.makeWordGuess(ethers.utils.toUtf8Bytes("world")),
                "Transaction failed");

              var input = await hangmanContract.currentMisses.call();
              assert.equal(input.toNumber(), 1, "current misses should have increased");
          });

          it("Test make char guess then correct word guess", async () => {
              await truffleAssert.passes(
                hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("e")),
                "Transaction failed");

              await truffleAssert.passes(
                hangmanContract.makeWordGuess(ethers.utils.toUtf8Bytes("hello")),
                "Transaction failed");

              var input = await hangmanContract.currentMisses.call();
              assert.equal(input.toNumber(), 0, "current misses should not have increased");
          });
      });

      describe("Test used characters", async () => {
          it("Test get used characters", async () => {
              await truffleAssert.passes(
                  hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("e")),
                  "Transaction failed");
              await truffleAssert.passes(
                  hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("l")),
                  "Transaction failed");

              let usedCharacters = await hangmanContract.getUsedCharacters.call();
              assert.equal(usedCharacters.length, 2, "used character count is incorrect")
              assert.equal(ethers.utils.toUtf8String(usedCharacters[0]), "e", "expected value not matched")
              assert.equal(ethers.utils.toUtf8String(usedCharacters[1]), "l", "expected value not matched")
          });
      });

      describe('Test characters that have been unveiled', async () => {
          it("Test getting correctly guessed characters", async () => {
              let tx = await hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("l"));
              truffleAssert.passes(tx, "Transaction failed");
              let guessedCharacters = await hangmanContract.getCorrectlyGuessedCharacters();

              assert.equal(ethers.utils.toUtf8String(guessedCharacters[0]), "\0", `guessed character at index 0 is ${guessedCharacters[0]} and not null`);
              assert.equal(ethers.utils.toUtf8String(guessedCharacters[1]), "\0", `guessed character at index 1 is ${guessedCharacters[1]} and not null`);
              assert.equal(ethers.utils.toUtf8String(guessedCharacters[2]), "l", `guessed character at index 2 is ${guessedCharacters[2]} and not l`);
              assert.equal(ethers.utils.toUtf8String(guessedCharacters[3]), "l", `guessed character at index 3 is ${guessedCharacters[3]} and not l`);
              assert.equal(ethers.utils.toUtf8String(guessedCharacters[4]), "\0", `guessed character at index 3 is ${guessedCharacters[4]} and not null`);
          });
      }); 

      describe("Test game over", async () => {
          it("Test game over and guess char", async () => {
              await truffleAssert.passes(
                  hangmanContract.makeWordGuess(ethers.utils.toUtf8Bytes("hello")),
                  "Transaction failed");

              await truffleAssert.reverts(
                  hangmanContract.makeCharGuess(ethers.utils.toUtf8Bytes("p")),
                  "solution is found");
          });

          it("Test game over and guess word", async () => {
              await truffleAssert.passes(
                  hangmanContract.makeWordGuess(ethers.utils.toUtf8Bytes("hello")),
                  "Transaction failed");

              await truffleAssert.reverts(
                  hangmanContract.makeWordGuess(ethers.utils.toUtf8Bytes("testing")),
                  "solution is found");
          });
      });
  });
});
