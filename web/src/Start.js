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
      console.log(window.web3.version);
      // Web3 browser user detected. You can now use the provider.
      let provider = window['ethereum'] || window.web3.currentProvider
      //NOTE: must wrap window.etherm to get provider, not window.web3
      provider = new ethers.providers.Web3Provider(window.ethereum);
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
      const signer = ethersContext.provider.getSigner();
      let factory = new ethers.ContractFactory(HangmanContract.abi, HangmanContract.bytecode, signer);
      //can I do hex with ethers? or do I need to use web 0.20?
      let hex = window.web3.toHex("hello");
      let contract = await factory.deploy(hex, 10);
      setEthersContext(state => ({ ...ethersContext, contract: contract}));
    } catch (error) {
      console.log(error);
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
