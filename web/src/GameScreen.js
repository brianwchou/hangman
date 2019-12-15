import React, { useState, useEffect, useContext } from 'react';	
import { Context } from './context.js';
import {Grid, Paper, Typography, Button, TextField, makeStyles} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 600
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
        spacing={1}
      >
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <img className={classes.img} src='https://d1nhio0ox7pgb.cloudfront.net/_img/i_collection_png/512x512/plain/guillotine.png' />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>item</Paper>
        </Grid>
      </Grid>
    </div>
  )
}

export default GameScreen;
