import React, { useState, useEffect, useContext } from 'react';	
import { Context } from './context';
import screens from './ScreenTypes';
import {Grid, Paper, Typography, Button, List, ListItem, TextField} from '@material-ui/core';

function GameOptions() {
  const [context, setContext] = useContext(Context)

  function setScreenType() {
    console.log("changing screen to GAME")
    let currentScreen = () => screens.GAME
    setContext(state => ({
      ...state,
      currentScreen
    }));
  }

  const connectWallet = async() => {
    if (!context.isLoggedIn) {
      await context.walletProvider.provider.enable()
      setContext(state => ({ ...state, isLoggedIn: true}));
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
