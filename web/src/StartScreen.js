import React, { useState, useEffect, useContext } from 'react';	
import { Context } from './context.js';
import GameOptions from './GameOptions.js';
import {Grid, Paper, Typography, Button} from '@material-ui/core';

function StartScreen() {
  const [context, setContext] = useContext(Context)
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
                <Paper>
                    <Typography variant="h3" component="h5">
                        Hangman
                    </Typography>
                </Paper>
            </Grid>
            <Grid item>
                <Button variant='contained' color='primary'>click me</Button>
            </Grid>
        </Grid>
    </div>
  )
}

export default StartScreen;
