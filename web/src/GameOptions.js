import React, { useContext, useState } from 'react';	
import { Context } from './context';
import { ethers } from 'ethers';
import HangmanFactoryJSON from './contracts/HangmanFactory.json';
import Hangman from './Hangman';
import {Grid, Typography, Button, TextField, LinearProgress} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2)
    }
  }
}));

function GameOptions({setScreen}) {
  const classes = useStyles();
  const [context, setContext] = useContext(Context)
  const [statusBar, setStatusBar] = useState(false)
  const [continueAddress, setContinueAddress] = useState('')
  const [continueDisabled, setContinueDisabled] = useState(true);

  const connectWallet = async() => {
    console.log(`[User Action]: connect wallet pressed`)

    if (context.isDebug) {
        setContext(state => ({ ...state, isLoggedIn: true}));
    } else {
      if (!context.isLoggedIn) {
        await context.walletProvider.provider.enable()
        setContext(state => ({ ...state, isLoggedIn: true}));

        // init factory
        const hangmanFactory = new ethers.Contract(
          "0xd723d7DE8C0811484dF4FBfa174555a2BCBF8aBA",
          HangmanFactoryJSON.abi,
          context.walletProvider.getSigner()
        );

        // init hangman
        let hangman = new Hangman(hangmanFactory)
        setContext(state => ({
          ...state,
          hangman
        }))
      }
    }
  }

  const newGame = async() => {
    console.log(`[User Action]: New Game button pressed`)
    if (context.isDebug) {
      setScreen('GAME')
    } else {
      setStatusBar(true)
      
      await context.hangman.newGame(
        "76ca51361e4e444f8a9b18ae350a5725", 
        context.walletProvider.provider.selectedAddress,
        context.walletProvider.getSigner(),
        () => {
          setStatusBar(false)
          setScreen('GAME')
        }
      )
    }
  }

  const addressOnChange = async (e) => {
    if (e.target.value.length == 0) {
      setContinueDisabled(true)
    } else {
      setContinueDisabled(false)
    }
    console.log(e.target.value)
    setContinueAddress(e.target.value)
  }

  const continueGame = async () => {
    console.log(`[User Action]: Continue Game button pressed`)
    if (context.isDebug) {
      setScreen('GAME')
    } else {
      context.hangman.setGame(
        continueAddress, 
        context.walletProvider.getSigner()
      )
      setScreen('GAME')
    }
  }

  return (
    (!context.isLoggedIn) ?
    <div>
      <Grid container justify='center' direction='column' spacing={1} alignItems='center'>
        <Grid item>
          <Button variant='contained' color='primary' onClick={connectWallet}>Connect Wallet</Button>
        </Grid>
      </Grid>
    </div>
    :
    <div>
      <Grid container justify='center' direction='column' spacing={1} alignItems='center'>
        <Grid item>
          <Typography align='center'>
            player address: {context.walletProvider.provider.selectedAddress}
          </Typography>
        </Grid>
        <Grid item>
          <Button variant='contained' color='primary' onClick={newGame}>New Game</Button>
        </Grid>
        { statusBar && 
          <Grid item className={classes.root}>
            <LinearProgress color="primary" variant="indeterminate"/>
          </Grid>
        }
        <Grid item>
          <Button variant='contained' color='primary' disabled={continueDisabled} onClick={continueGame}>Continue Game</Button>
        </Grid>
        <Grid item>
          <TextField id="outlined-basic" label="Contract Address" variant="outlined" onChange={addressOnChange} />
        </Grid>
      </Grid>
    </div>
  )
}

export default GameOptions;
