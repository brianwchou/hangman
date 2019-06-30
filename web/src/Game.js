import React, { useState, useEffect, useContext } from 'react';
import { EthersContext } from './EthersContext.js';
import UsedChars from './UsedChars';
import WinState from './WinState';
import GuessCounter from './GuessCounter';

function Game() {
  const [ethersContext, setEthersContext] = useContext(EthersContext);
  const [hangmanString, setHangmanString] = useState("");
  const [charGuess, setCharGuess] = useState("");
  const [wordGuess, setWordGuess] = useState("");
  const [currentMisses, setCurrentMisses] = useState(0);
  const [maxMisses, setMaxMisses] = useState(0);
  const [usedChars, setUsedChars] = useState([]);
  const [winState, setWinState] = useState(0); //-1 is lose, +1 is win

  ethersContext.contract.on('TurnTaken', () => {
    console.log("Turn Taken");
  });

  ethersContext.contract.on('GameWin', () => {
    console.log("Game Win");
    setWinState(1)
  });

  ethersContext.contract.on('GameLose', () => {
    console.log("Game Lose");
    setWinState(-1)
  });


  // Similar to componentDidMount and componentDidUpdate
  useEffect(() => {
    updateVisibleChars();
    updateGuessCounter();
  }, []);

  function clearInputs() {
    setCharGuess("");
    setWordGuess("");
  }

  async function handlePostActions() {
    clearInputs();
    updateGuessCounter();
    updateVisibleChars();
    updateUsedChars();
  }

  async function updateGuessCounter() {
    let numerator = await ethersContext.contract.currentMisses();
    setCurrentMisses(numerator.toNumber());
    let denominator = await ethersContext.contract.maxAllowedMisses();
    setMaxMisses(denominator.toNumber());
  }

  async function updateVisibleChars() {
    let hexChars = await ethersContext.contract.getCorrectlyGuessedCharacters();
    console.log(hexChars);

    //convert hex representation to char representation
    let result = hexChars.map( hex => {
        return hex !== "0x00" ? window.web3.toAscii(hex) : "_";
    }).join(" ");
    console.log(result);
    setHangmanString(result);
  }

  async function updateUsedChars() {
    let hexChars = await ethersContext.contract.getUsedCharacters();
    console.log(hexChars);

    //convert hex representation to char representation
    let result = hexChars.map( hex => {
        return hex !== "0x00" ? window.web3.toAscii(hex) : "_";
    }).join(" ");
    console.log(result);
    setUsedChars(result);
  }

  async function guessChar() {
    if (ethersContext.contract === undefined) {
      console.log("no contract deployed");
      return;
    } else if (charGuess === "") {
      console.log("no character in box");
      return;
    } else if (charGuess.length > 1) {
      console.log("1 character only");
      return;
    }

    console.log(ethersContext.contract);
    let guess = window.web3.fromAscii(charGuess);
    console.log(guess);
    let tx = await ethersContext.contract.makeCharGuess(guess);
    console.log(tx);
    await tx.wait();
    handlePostActions();
  }

  async function guessWord() {
    if (ethersContext.contract === undefined) {
      console.log("no contract deployed");
      return;
    }  else if (wordGuess === "") {
      console.log("no word in box");
      return;
    }
    console.log(ethersContext.contract);
    let guess = window.web3.fromAscii(wordGuess);
    console.log(guess);
    let tx = await ethersContext.contract.makeWordGuess(guess);
    console.log(tx);
    await tx.wait();
    handlePostActions();
  }
  
  return (
    <div>
     { hangmanString }
      <br />
      <input
        type="text"
        name="character"
        placeholder="character"
        value={ charGuess }
        maxLength="1"
        onChange={ e => setCharGuess(e.target.value) }
      />&nbsp;
      <button type="button" onClick={ guessChar }>Guess Character</button>
      <br />

      <input
        type="text"
        name="word"
        placeholder="word"
        value={ wordGuess }
        onChange={ e => setWordGuess(e.target.value) }
      />&nbsp;
      <button type="button" onClick={ guessWord }>Guess Word</button>
      <br />
      <br />

      <GuessCounter 
        numerator={ currentMisses }
        denominator={ maxMisses }
      />

      <br />
      <UsedChars chars={ usedChars } />
      <br />
      <WinState winState={ winState } />
    </div>
  );
}

export default Game;
