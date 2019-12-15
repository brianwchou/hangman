import React, { useState, useEffect, useContext } from 'react';	
import { Context } from './context.js';
import {Grid, Paper, Typography, Button, TextField, makeStyles} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 500
  },
  img: {
    maxHeight: '100%',
    maxWidth: '100%'
  }
}));

function GameScreen() {
  const [context, setContext] = useContext(Context)
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container
        justify='center'
        spacing={3}
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
