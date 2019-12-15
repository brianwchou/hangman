import React, { useEffect, useContext, useState } from 'react';
import { Context } from './context';
import StartScreen from './StartScreen.js';
import GameScreen from './GameScreen.js';
import Hangman from './Hangman.js';
import { ethers } from 'ethers';


function App() {
  const [context, setContext] = useContext(Context);
  const screens = {
    START: StartScreen,
    GAME: GameScreen,
  }
  const [currentScreen, setCurrentScreen] = useState(screens.START);
  

  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', accounts => {
      // should update context when user change is detected
      if (context.address && context.address !== accounts[0]) {
        setContext(state => ({ ...state, address: accounts[0] }));
        // eslint-disable-next-line no-console
        console.log(`Address was updated ${accounts[0]}`);
      }
    });
  }

  useEffect(() => {
    async function load() {
      if (typeof window.ethereum !== 'undefined') {
        let address = '';
        try {
//          address = await window.ethereum.enable();
//          // eslint-disable-next-line no-console
//          console.log(`address ${address}`);
        } catch (error) {
          setContext(state => ({
            ...state,
            error: `Web3 Loading Error 1: ${error}`
          }));
        }

        setContext(state => ({
          ...state,
          address
        }));

        try {
          if (
            typeof window.ethereum !== 'undefined' ||
            typeof window.web3 !== 'undefined'
          ) {
            const walletProvider = new ethers.providers.Web3Provider(
              window.web3.currentProvider
            );

//            // connect to contracts on the network
//            const HangmanContract = new ethers.Contract(
//              hangman_contract_address,
//              hangman_abi,
//              walletProvider.getSigner()
//            );
//            const Hangman = new Hangman(HangmanContract, address[0]);
//
//            setContext(state => ({
//              ...state,
//              Hangman,
//              provider: walletProvider
//            }));
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log('Web3 Loading Error: ', error.message);
          setContext(state => ({
            ...state,
            error: `Web3 Loading Error 2: ${error}`
          }));
        }
      } else {
        setContext(() => ({
          error: 'Web3 Loading Error: no window.ethereum'
        }));
      }
    }
    load();
  }, []);

  //context.contract = ""
  return currentScreen;
}

export default App;
