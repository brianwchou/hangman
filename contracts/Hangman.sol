pragma solidity ^0.5.0;

contract Hangman {
    address public playerAddress; // public gets an automatic getter
    bytes private solution;
    uint public maxGuesses;
    uint public currentGuesses;
    uint public playerInput; // 256 bits
    bytes1[] public usedCharacters;


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

    function getUsedCharacters() view external returns (bytes1[] memory) {
        bytes1[] memory returnObj = new bytes1[](usedCharacters.length);
        for(uint i = 0; i < usedCharacters.length; i++) {
            returnObj[i] = usedCharacters[i];
        }
        return returnObj;
    }

    function makeCharGuess(byte _character) external {
        require(currentGuesses < maxGuesses, "no more guesses available");
        require(playerInput < 2**(solution.length), "solution is found"); // becareful of overflow

        //go through and check if the character has already been guessed
        for (uint i = 0; i < usedCharacters.length; i++) {
            require(usedCharacters[i] != _character, "character has aleady been guessed");
        }
        //add the character if it hasn't been guessed
        usedCharacters.push(_character);

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
        require(solution.length == _string.length, "invalid string length");

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
