import React, { useState, useEffect, useContext } from 'react';	
import { Context } from './context.js';
import {Grid, Paper, Typography, Button, List, ListItem, TextField} from '@material-ui/core';

function GameOptions() {
  const [context, setContext] = useContext(Context)

  return (
    <div>
      <Grid item>
        <Button variant='contained' color='primary'>Connect Wallet</Button>

        <Typography align='center'>
          player address: 0xb893D8F6779842959C1dfC3095b1c62ceAA16703
        </Typography>

        <Button variant='contained' color='primary'>New Game</Button>
        <Button variant='contained' color='primary'>Continue Game</Button>
        <TextField id="outlined-basic" label="Contract Address" variant="outlined" />
      </Grid>
    </div>
  )
}

export default GameOptions;
