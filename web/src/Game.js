import React, { useState, useEffect, useContext } from 'react';
import { EthersContext } from './EthersContext.js';

function Game() {

  const [ethersContext, setEthersContext] = useContext(EthersContext);
  const [hangmanString, setHangmanString] = useState("");

  async function guessChar() {
    console.log(ethersContext.contract);
    let guess = window.web3.fromAscii("h");
    let tx = await ethersContext.contract.makeCharGuess(guess);
    console.log(tx);
    await tx.wait();
  }

  async function guessWord() {
    console.log(ethersContext.contract);
    let guess = window.web3.fromAscii("h");
    let tx = await ethersContext.contract.makeWordGuess(guess);
    console.log(tx);
    await tx.wait();
  }

  return (
    <div>
     { hangmanString }
      <br />
      <input
          type = "text"
          name = "character"
          placeholder = "character"
      />&nbsp;
      <button type="button" onClick={ guessChar }>Guess Character</button>
      <br />

      <input
          type = "text"
          name = "character"
          placeholder = "word"
      />&nbsp;
      <button type="button" onClick={ guessWord }>Guess Word</button>
      <br />
    </div>
  );
}

export default Game;
