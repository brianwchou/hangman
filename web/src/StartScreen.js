import React, { useState, useEffect, useContext } from 'react';	
import { Context } from './context.js';
import GameOptions from './GameOptions.js';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Paper, Typography, Button} from '@material-ui/core';

function StartScreen() {
  const [context, setContext] = useContext(Context);

  return (
    <div>
      <Grid   
        container 
        direction='column'
        justify='center' 
        spacing={3}
        alignItems='center'
        style={{ minHeight: '100vh' }}
      >
        <Grid item>
          <Paper elevation={0}>
            <Typography variant="h1">
              Hangman
            </Typography>
          </Paper>
        </Grid>
        <Grid item>
          <Button variant='contained' color='primary'>Connect Wallet</Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default StartScreen;
