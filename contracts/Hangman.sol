pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract Hangman is Ownable {
    bytes private solution;
    uint public maxAllowedMisses;
    uint public currentMisses; //defaults to 0
    bytes1[] private usedCharacters;
    uint public playerInput; //represented as an integer reverse binary of the string

    //events
    event GameWin();
    event GameLose();
    event TurnTaken();

    /*
     * @notice Initializes the Hangman Game with a solution
     * @dev only the owner can set the game. This will be done by the factory
     * @param bytes the solution
     * @param uint the maximum allowed number of misses before it's game over
     */
    function setSolution(bytes _solution, uint _maxAllowedMisses) external onlyOwner {
        require(solution.length == 0, "solution already set");
        solution = _solution;
        maxAllowedMisses = _maxAllowedMisses;
    }

    modifier gameReady() {
        require(solution.length > 0, "solution not set");
        _;
    }

    /*
     * @notice retrieves the used characters
     * @return bytes1[] an array of the used characters
     */
    function getUsedCharacters() external view returns (bytes1[] memory) {
        bytes1[] memory characters = new bytes1[](usedCharacters.length);
        for(uint i = 0; i < usedCharacters.length; i++) {
            characters[i] = usedCharacters[i];
        }
        return characters;
    }

    /*
     * @notice Makes a character guess against the word
     * @param byte the character that is being guessed
     */
    function makeCharGuess(byte _character) external onlyOwner gameReady {
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
        for (uint m = 0; m < solution.length; m++) {
            if (solution[m] == _character) {
                //if they got a character correct
                playerInput = computeGuess(m);
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

    /*
     * @notice computes if the guessed character at an index mathces
     * @return uint 1 if there is a match 0 otherwise
     */
    function computeGuess(uint i) private view returns (uint output) {
        assembly {
            //reference playerInput storage variable
            //NOTE: this saves the representation of the word backwards
            //left most digit should be Most significant bit, instead it is the least significant bit
            output := or(sload(playerInput_slot), exp(2, i))
        }
    }

    /*
     * @notice Make a word guess
     */
    function makeWordGuess(bytes _string) external onlyOwner gameReady {
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
        playerInput = 2**(solution.length) - 1;
        emit GameWin();
    }

    /*
     * @notice Gets the total number of characters in the solution
     * @return uint the total number of characters
     */
    function getNumberOfCharacters() external view returns (uint) {
        return solution.length;
    }

    /*
     * @notice Gets all the correctly guessed characters at their positions
     * @return bytes1[] all the correctly guessed characters at their indices
     */
    function getCorrectlyGuessedCharacters() external view returns (bytes1[] memory) {
        bytes1[] memory output = new bytes1[](solution.length);

        for (uint i = 0; i < solution.length; i++) {
            if (hasBitAtIndex(i)) {
                output[i] = solution[i];
            }
        }
        return output;
    }

    /*
     * @notice Determines if there is a bit at a given index
     * @param uint the index in quesiton
     * @return bool true if there is a bit at given index, false otherwise
     */
    function hasBitAtIndex(uint i) private view returns (bool output) {
        assembly {
            // determine if bit is correctly set or not n & (1 << (i - 1))
            output := gt(and(sload(playerInput_slot), shl(i, 1)), 0)
        }
    }
}
