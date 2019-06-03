import React, { useState, useEffect, useContext } from 'react';
import { EthersContext } from './EthersContext.js';

function Game() {

  const [ethersContext, setEthersContext] = useContext(EthersContext);
  const [hangmanString, setHangmanString] = useState("");

  function test() {
    console.log(ethersContext);
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
      <button type="button" onClick={ test }>Guess Character</button>
      <br />

      <input
          type = "text"
          name = "character"
          placeholder = "word"
      />&nbsp;
      <button type="button" onClick={ test }>Guess Word</button>
      <br />
    </div>
  );
}

export default Game;
