import React, { useContext } from 'react';	
import { Context } from './context';
import { ethers } from 'ethers';
import screens from './ScreenTypes';
import HangmanFactoryJSON from './contracts/HangmanFactory.json';
import {Grid, Typography, Button, TextField} from '@material-ui/core';

function GameOptions({setScreen}) {
  const [context, setContext] = useContext(Context)

  function setScreenType() {
    console.log("changing screen to GAME")
    console.log(setScreen)
    setScreen(() => screens.GAME)
  }

  const connectWallet = async() => {
    if (!context.isLoggedIn) {
      await context.walletProvider.provider.enable()
      setContext(state => ({ ...state, isLoggedIn: true}));

      const hangman = new ethers.Contract(
        "0xd723d7DE8C0811484dF4FBfa174555a2BCBF8aBA",
        HangmanFactoryJSON.abi,
        context.walletProvider.getSigner()
      );

      setContext(state => ({
        ...state,
        hangman
      }))
    }
  }

  const newGame = async() => {
    console.log(context)
    setScreenType()
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
