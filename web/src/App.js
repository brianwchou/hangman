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

  useEffect(() => {
    // define all needed context variables here:
    let hangman = null;
    let walletProvider = null;
    let isLoggedIn = false;
    setContext(state => ({
      ...state,
      hangman,
      walletProvider,
      isLoggedIn
    }));

    async function load() {
      if (typeof window.ethereum !== 'undefined') {
        // detect when accounts changes
        window.ethereum.on('accountsChanged', accounts => {
          console.log("Accounts changed, log user out and bring back to connect wallet screen")
          // log user out
          setContext(state => ({ ...state, isLoggedIn: false }));
          // bring user back to start screen
          setCurrentScreen(() => screens.START)
          // eslint-disable-next-line no-console
        });

        try {
          // capture wallet provider
          let provider = new ethers.providers.Web3Provider(window.ethereum);
          setContext(state => ({ ...state, walletProvider: provider}));
        } catch (error) {
          setContext(state => ({
            ...state,
            error: `Web3 Loading Error 1: ${error}`
          }));
        }
      }
    }
    load();
  }, []);

  console.log(context)
  console.log(setCurrentScreen)
  return (
    <Container>
      {currentScreen(setCurrentScreen, classes)}
    </Container>
  ) 
}

export default App;
