pragma solidity ^0.5.0;

contract Hangman {
    address public playerAddress; // public gets an automatic getter
    bytes private solution;
    uint public maxGuesses;
    uint public currentGuesses;
    uint public playerInput; // 256 bits
    //events
    event GameWin();
    event GameLose();
    event TurnTaken();

    constructor(bytes memory _solution, uint _maxGuesses) public {
        playerAddress = msg.sender;
        solution = _solution;
        maxGuesses = _maxGuesses;
        currentGuesses = 0;
    }

    function makeCharGuess(byte _character) external {
        require(currentGuesses < maxGuesses, "no more guesses available");
        require(playerInput < 2**(solution.length), "solution is found"); // becareful of overflow

        currentGuesses += 1; // increment currentguesses by 1

        // uint check = 0; // check is the reverse representation of string inputs
        for (uint i = 0; i < solution.length; i++) {
            if (solution[i] == _character) {
                playerInput = computeGuess(i);
            }
        }

        if (playerInput == 2**(solution.length) - 1) { //if input is ever greater then playerInput is always invalid
            emit GameWin();
        } else if (currentGuesses >= maxGuesses) {
            emit GameLose();
        } else {
            emit TurnTaken();
        }
    }

    function computeGuess(uint i) private view returns (uint output) {
        assembly {
            //reference global
            output := or(sload(playerInput_slot), exp(2, i))
        }
    }

    function makeWordGuess(bytes calldata _string) external {
        require(currentGuesses < maxGuesses, "no more guesses available");
        require(playerInput < 2**(solution.length), "solution is found");

        currentGuesses += 1;
        for (uint i = 0; i < solution.length; i++) {
            if (solution[i] != _string[i]) {
                emit TurnTaken();
                return;
            }
        }
        emit GameWin();
    }

    function getNumberOfCharacters() public view returns (uint) {
        return solution.length;
    }
}