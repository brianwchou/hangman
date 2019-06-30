pragma solidity ^0.5.0;

import 'node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract Hangman is Ownable {
    bytes private solution;
    uint public maxAllowedMisses;
    uint public currentMisses;
    bytes1[] private usedCharacters;
    uint public playerInput; //represented an integer reverse binary of the string

    //events
    event GameWin();
    event GameLose();
    event TurnTaken();

    constructor(bytes memory _solution, uint _maxAllowedMisses) public {
        solution = _solution;
        maxAllowedMisses = _maxAllowedMisses;
        currentMisses = 0;
    }

    function getUsedCharacters() external view returns (bytes1[] memory) {
        bytes1[] memory characters = new bytes1[](usedCharacters.length);
        for(uint i = 0; i < usedCharacters.length; i++) {
            characters[i] = usedCharacters[i];
        }
        return characters;
    }

    function makeCharGuess(byte _character) external {
        require(currentMisses < maxAllowedMisses, "no more guesses available");
        require(playerInput < 2**(solution.length), "solution is found"); // becareful of overflow

        emit TurnTaken();

        //go through and check if the character has already been guessed
        for (uint i = 0; i < usedCharacters.length; i++) {
            require(usedCharacters[i] != _character, "character has aleady been guessed");
        }
        //add the character if it hasn't been guessed
        usedCharacters.push(_character);

        uint playerInputCheckpoint = playerInput;
        // check is the reverse representation of string inputs
        for (uint i = 0; i < solution.length; i++) {
            if (solution[i] == _character) {
                //if they got a character correct
                playerInput = computeGuess(i);
            }
        }

        //if player input is unchanged then the guess is marked against them
        if (playerInputCheckpoint == playerInput) {
            currentMisses += 1; 
        }

        if (playerInput == 2**(solution.length) - 1) { //if input is ever greater then playerInput is always invalid
            emit GameWin();
        } else if (currentMisses >= maxAllowedMisses) {
            emit GameLose();
        }
    }

    function computeGuess(uint i) private view returns (uint output) {
        assembly {
            //reference playerInput storage variable
            //NOTE: this saves the represnetation of the word backwards
            //left most digit should be Most significant bit, instead it is the least significant bit
            output := or(sload(playerInput_slot), exp(2, i))
        }
    }

    function makeWordGuess(bytes calldata _string) external {
        require(currentMisses < maxAllowedMisses, "no more guesses available");
        require(playerInput < 2**(solution.length), "solution is found");

        emit TurnTaken();

        //compare the strings
        if(keccak256(abi.encodePacked(solution)) != keccak256(abi.encodePacked(_string))) {
            currentMisses += 1;
            if (currentMisses >= maxAllowedMisses) {
                emit GameLose();
            }
            return;
        }
        //set the playerInput to answer
        playerInput = 2**(solution.length);
        emit GameWin();
    }

    function getNumberOfCharacters() external view returns (uint) {
        return solution.length;
    }

    function getCorrectlyGuessedCharacters() external view returns (bytes1[] memory) {
        bytes1[] memory output = new bytes1[](solution.length);

        for (uint i = 0; i < solution.length; i++) {
            if (hasBitAtIndex(i)) {
                output[i] = solution[i];
            }
        }
        return output;
    }

    function hasBitAtIndex(uint i) private view returns (bool output) {
        assembly {
            // determine if bit is corerctly set or not n & (1 << (i - 1))
            output := gt(and(sload(playerInput_slot), shl(i, 1)), 0)
        }
    }

}
