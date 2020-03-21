import React, { useContext } from 'react';	
import { Context } from './context.js';
import GameOptions from './GameOptions.js';
import {Grid, Paper, Typography} from '@material-ui/core';

function StartScreen(setScreen, classes) {
  const [context, setContext] = useContext(Context);
  console.log(classes)
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
              Guillotine.eth
            </Typography>
          </Paper>
        </Grid>
        <Grid item>
          <GameOptions setScreen={setScreen}/>
        </Grid>
      </Grid>
    </div>
  )
}

export default StartScreen;
