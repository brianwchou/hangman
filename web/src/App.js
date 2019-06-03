import React, { useState, useEffect, useContext } from 'react';
import logo from './logo.svg';
import './App.css';
import Game from './Game.js';
import { ethers } from 'ethers';

const HangmanContext = React.createContext("gamestate");

function App() {

  const [provider, setProvider] = useState();
  const [selectedAddress, setSelectedAddress] = useState();
  const hangmanContext = useContext(HangmanContext);

  window.ethereum.on('accountsChanged', function (accounts) {
    if(selectedAddress !== undefined) {
      setSelectedAddress(accounts[0])
    }
  })

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined'
      || (typeof window.web3 !== 'undefined')) {
      // Web3 browser user detected. You can now use the provider.
      let provider = window['ethereum'] || window.web3.currentProvider
      provider = new ethers.providers.Web3Provider(provider);
      setProvider(provider)
    }
  }, []);

  async function startGame() {
    console.log(hangmanContext);
    try{
      if(selectedAddress === undefined) {
        console.log("No selected address, requesting log in")
        let account = await window.ethereum.enable();
        console.log("Selected Address is: " + account[0])
        setSelectedAddress(account[0]);
      } else {
        console.log("Selected Address is: " + selectedAddress);
      }
    } catch (error) {
      console.log(error.reason === "User rejected provider access")
    }
  }

  return (
    <HangmanContext.Provider>
      <div>
        Current Address: { selectedAddress }
        <br />
        <button type="button" onClick={ startGame }>Start Game</button>
        <Game/>
      </div>
    </HangmanContext.Provider>
  );
}

export default App;
