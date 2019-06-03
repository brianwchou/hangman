import React, { useState, useEffect, useContext } from 'react';
import { EthersContext } from './EthersContext.js';
import { ethers } from 'ethers';
import HangmanContract from './contracts/Hangman.json';

function Start() {
  const [ethersContext, setEthersContext] = useContext(EthersContext);
  const [selectedAddress, setSelectedAddress] = useState();

  // Detect when account changes
  window.ethereum.on('accountsChanged', function (accounts) {
    if(selectedAddress !== undefined) {
      setSelectedAddress(accounts[0])
    }
  })

  // Similar to componentDidMount and componentDidUpdate
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined'
      || (typeof window.web3 !== 'undefined')) {
      // Web3 browser user detected. You can now use the provider.
      let provider = window['ethereum'] || window.web3.currentProvider
      provider = new ethers.providers.Web3Provider(provider);
      setEthersContext(state => ({ ...ethersContext, provider }));
    }
  }, []);

  // Start Game function that collects address
  async function startGame() {
    try{
      if(selectedAddress === undefined) {
        console.log("No selected address, requesting log in")
        let account = await window.ethereum.enable();
        console.log("Selected Address is: " + account[0])
        setSelectedAddress(account[0]);
      } else {
        console.log("Selected Address is: " + selectedAddress);
      }

      //deploy the contract here
      let factory = new ethersContext.ContractFactory(HangmanContract.abi, HangmanContract.bytecode);
      console.log(factory);
      
    } catch (error) {
      console.log(error.reason === "User rejected provider access")
    }
  }

  return(
    <div>
      Current Address: { selectedAddress }
      <br />
      <button type="button" onClick={ startGame }>Start Game</button>
    </div>
  );
}

export default Start;
