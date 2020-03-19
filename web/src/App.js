import React, { useEffect, useContext, useState } from 'react';
import { Context } from './context';
import screens from './ScreenTypes';
import Hangman from './Hangman';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core'
import { ethers } from 'ethers';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 500
  },
  img: {
    maxHeight: '100%',
    maxWidth: '100%'
  }
}));

function App() {
  const [context, setContext] = useContext(Context);
  const [currentScreen, setCurrentScreen] = useState(() => screens.START);

  const classes = useStyles();
  

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

          // capture window here
          setContext(state => ({ ...state, ethereum: window.ethereum}));
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

  console.log(setCurrentScreen)
  return (
    <Container>
      {currentScreen(setCurrentScreen, classes)}
    </Container>
  ) 
}

export default App;
