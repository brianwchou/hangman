import React, { useState, useEffect, useContext } from 'react';	
import { Context } from './context.js';
import {Grid, Paper, Typography, Button, List, ListItem} from '@material-ui/core';

function GameOptions() {
  const [context, setContext] = useContext(Context)

  return (
    <div>
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
    </div>
  )
}

export default GameOptions;
