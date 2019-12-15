import React, { useState, useEffect, useContext } from 'react';	
import { Context } from './context.js';
import {Grid, Paper, Typography, Button, TextField, makeStyles} from '@material-ui/core';

function GameScreen(setScreen, classes) {
  const [context, setContext] = useContext(Context)
  console.log(classes); 
  return (
    <div className={classes.root}>
      <Grid container
        justify='center'
        spacing={1}
        alignItems='center'
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={6}>
          <Paper className={classes.paper}>
          <img className={classes.img} src='https://d1nhio0ox7pgb.cloudfront.net/_img/i_collection_png/512x512/plain/guillotine.png' />
            <Typography>
              Hangman Word Here
            </Typography>
         </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Grid container
              justify='center'
              direction='column'
              spacing={1}
              alignItems='center'
              style={{ minHeight: '50vh' }}
            >
              <Typography>
                Guesses Left 50/50
              </Typography>
              <Typography>
                Used Characters: a b c d e f g h i j k l m n o p q r s t u v w x y z
              </Typography>
              <Grid item>
                <TextField id="outlined-basic" label="Guess Word" variant="outlined" />
              </Grid>
              <Grid item>
                <TextField id="outlined-basic" label="Guess Character" variant="outlined" />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

export default GameScreen;
