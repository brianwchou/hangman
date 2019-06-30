pragma solidity ^0.5.0;

import "./Hangman.sol";

contract StartGame {
    function createHangmanContract() public returns (address) {
        bytes memory word = "cheese";
        Hangman game = new Hangman(word , word.length);
        game.transferOwnership(msg.sender);
        return address(game);
    }
}