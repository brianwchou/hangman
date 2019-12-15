import React, { useState, useEffect, useContext } from 'react';	
import { Context } from './context.js';
import GameOptions from './GameOptions.js';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Paper, Typography, Button, List, ListItem} from '@material-ui/core';

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
          <Paper elevation={0}>
            <List>
              <ListItem>address: 0xb893D8F6779842959C1dfC3095b1c62ceAA16703</ListItem>
              <ListItem selected>start new game</ListItem>
              <ListItem>play unfinished contract</ListItem>
            </List>
          </Paper>
          <Button variant='contained' color='primary'>Connect Wallet</Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default StartScreen;
