import React, { useState, useEffect, useContext } from 'react';	
import { Context } from './context.js';
import screens from './ScreenTypes';
import {Grid, Paper, Typography, Button, List, ListItem, TextField} from '@material-ui/core';

function GameOptions({setScreen}) {
  const [context, setContext] = useContext(Context)

  function setScreenType() {
    console.log("changing screen to GAME")
    setScreen(() => screens.GAME)
  }

  return (
    <div>
      <Grid container
        justify='center'
        direction='column'
        spacing={1}
        alignItems='center'
      >
        <Grid item>
          <Button variant='contained' color='primary'>Connect Wallet</Button>
        </Grid>
        <Grid item>
          <Typography align='center'>
            player address: 0xb893D8F6779842959C1dfC3095b1c62ceAA16703
          </Typography>
        </Grid>
        <Grid item>
          <Button variant='contained' color='primary' onClick={setScreenType}>New Game</Button>
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
