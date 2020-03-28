import React, { useEffect, useContext, useState } from 'react';
import { Context } from './context';
import StartScreen from './StartScreen';
import GameScreen from './GameScreen';
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
  const [currentScreen, setCurrentScreen] = useState('START');
  const classes = useStyles();
  console.log(`[UI App] Application start`)

  useEffect(() => {
    // define all needed context variables here:
    let hangman = null;
    let walletProvider = null;
    let isLoggedIn = false;
    let isDebug = true;
    setContext(state => ({
      ...state,
      hangman,
      walletProvider,
      isLoggedIn,
      isDebug
    }));

    async function load() {
      if (typeof window.ethereum !== 'undefined') {
        // detect when accounts changes
        window.ethereum.on('accountsChanged', accounts => {
          console.log(`[Metamask]: Accounts changed to ${accounts[0]}`)
          // log user out
          setContext(state => ({ ...state, isLoggedIn: false }));
          // bring user back to start screen
          setCurrentScreen('START')
          // eslint-disable-next-line no-console
        });

        try {
          // capture wallet provider
          let provider = new ethers.providers.Web3Provider(window.ethereum);
          setContext(state => ({ ...state, walletProvider: provider}));
        } catch (error) {
          console.log(`[Metamask]: ERROR loading provider`)
          setContext(state => ({
            ...state,
            error: `Web3 Loading Error 1: ${error}`
          }));
        }
      }
    }
    load();
  }, []);

  function screenChange(screen) {
    switch(currentScreen) {
      case 'START':
        return <StartScreen setScreen={setCurrentScreen}/>
      case 'GAME':
        return <GameScreen/>
    }
  }

  console.log(context)
  return (
    <Container>
      {screenChange(currentScreen)}
    </Container>
  ) 
}

export default App;
