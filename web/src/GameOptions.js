import React, { useContext, useState } from 'react';	
import { Context } from './context';
import { ethers } from 'ethers';
import HangmanFactoryJSON from './contracts/HangmanFactory.json';
import Hangman from './Hangman';
import {Grid, Typography, Button, TextField, LinearProgress} from '@material-ui/core';

function GameOptions({setScreen}) {
  const [context, setContext] = useContext(Context)
  const [barCompleted, setBarCompleted] = useState(0)

  const connectWallet = async() => {
    if (context.isDebug) {
        setContext(state => ({ ...state, isLoggedIn: true}));
    } else {
      if (!context.isLoggedIn) {
        await context.walletProvider.provider.enable()
        setContext(state => ({ ...state, isLoggedIn: true}));

        // init factory
        const hangmanFactory = new ethers.Contract(
          "0xd723d7DE8C0811484dF4FBfa174555a2BCBF8aBA",
          HangmanFactoryJSON.abi,
          context.walletProvider.getSigner()
        );

        // init hangman
        let hangman = new Hangman(hangmanFactory)
        setContext(state => ({
          ...state,
          hangman
        }))
      }
    }
  }

  const newGame = async() => {
    if (context.isDebug) {
      setScreen('GAME')
    } else {
      console.log(context)
      const {selectedAddress} = context.walletProvider.provider
      const {getSigner} = context.walletProvider
      const callbackUIActions = {
        setBarCompleted,
        changeScreen: () => { setScreen('GAME') }
      }

      let gameCreated = await context.hangman.newGame(
        "76ca51361e4e444f8a9b18ae350a5725", 
        selectedAddress,
        getSigner(),
        callbackUIActions
      )
    }
  }

  return (
    (!context.isLoggedIn) ?
    <div>
      <Grid container
        justify='center'
        direction='column'
        spacing={1}
        alignItems='center'
      >
        <Grid item>
          <Button variant='contained' color='primary' onClick={connectWallet}>Connect Wallet</Button>
        </Grid>
      </Grid>
    </div>
    :
    <div>
      <Grid container
        justify='center'
        direction='column'
        spacing={1}
        alignItems='center'
      >
        <Grid item>
          <Typography align='center'>
            player address: {context.walletProvider.provider.selectedAddress}
          </Typography>
        </Grid>
        <Grid item>
          <Button variant='contained' color='primary' onClick={newGame}>New Game</Button>
          <LinearProgress color="secondary" variant="determinate" value={barCompleted}/>
        </Grid>
        <Grid item>
          <Button variant='contained' color='primary'>Continue Game</Button>
        </Grid>
        <Grid item>
          <TextField id="outlined-basic" label="Contract Address" variant="outlined" />
        </Grid>
      </Grid>
    </div>
  )
}

export default GameOptions;
