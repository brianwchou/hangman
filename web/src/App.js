import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Game from './Game.js';
import { ethers } from 'ethers';

const HangmanContext = React.createContext("gamestate");

function App() {

  const [provider, setProvider] = useState();

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined'
      || (typeof window.web3 !== 'undefined')) {
      // Web3 browser user detected. You can now use the provider.
      let provider = window['ethereum'] || window.web3.currentProvider
      provider = new ethers.providers.Web3Provider(provider);
      console.log(window.ethereum.selectedAddress);
      setProvider(provider)
    }
  }, []);

  return (
    <HangmanContext.Provider>
      <div>
        <button type="button">Start Game</button>
        <Game/>
      </div>
    </HangmanContext.Provider>
  );
}

export default App;
