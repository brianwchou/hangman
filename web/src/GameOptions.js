import React, { useState, useEffect, useContext } from 'react';	
import { Context } from './context';
import screens from './ScreenTypes';
import {Grid, Paper, Typography, Button, List, ListItem, TextField} from '@material-ui/core';

function GameOptions({setScreen}) {
  const [context, setContext] = useContext(Context)

  function setScreenType() {
    console.log("changing screen to GAME")
    console.log(setScreen)
    setScreen(() => screens.GAME)
  }

  const connectWallet = async() => {
    if (context.walletProvider && !context.walletProvider.provider.selectedAddress) {
      let address = await context.walletProvider.provider.enable()
      setContext(state => ({ ...state, address: address[0]}));
    }
  }

  const newGame = async() => {
    console.log(context)
    setScreenType()
  }

  return (
    (!context.address) ?
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
            player address: {context.address}
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
