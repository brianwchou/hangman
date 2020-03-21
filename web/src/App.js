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
  const classes = useStyles();
  
  // update address when accounts change
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', accounts => {
      setContext(state => ({ ...state, isLoggedIn: false }));
      console.log("Accounts changed, user logged out")
      // eslint-disable-next-line no-console
    });
  }

  useEffect(() => {
    // define all needed context variables here:
    let hangman = null;
    let walletProvider = null;
    let isLoggedIn = false;
    let currentScreen = screens.START;
    setContext(state => ({
      ...state,
      hangman,
      walletProvider,
      isLoggedIn,
      currentScreen
    }));

    async function load() {
      if (typeof window.ethereum !== 'undefined') {
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
  return (
    (context.currentScreen) ?
    <Container>
        {context.currentScreen(classes)}
    </Container>
    :
    <div>
      Loading...
    </div>
  ) 
}

export default App;
