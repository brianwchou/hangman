import React, { useContext, useState } from 'react';	
import { Context } from './context';
import {Grid, Paper, Typography, Button, TextField} from '@material-ui/core';

function GameScreen(classes) {
  const [context, setContext] = useContext(Context)
  const [displayWord, setDisplayWord] = useState()
  const [word, setWord] = useState('')
  const [char, setChar] = useState('')
  console.log(`[UI GameScreen]: load`)

  function handleWordGuessChange(e) {
    setWord(e.target.value)
  }

  function handleCharGuessChange(e) {
    if (e.target.value.length <= 1) { 
      setChar(e.target.value)
    }
  }

  const submitWord = async () => {
    console.log(`[User Action]: Submit word ${word}`)
    if (!context.isDebug) {
      await context.hangman.makeWordGuess(word, async () => {
        // getCorrectlyGuessedCharacters()
        // getUsedCharacters()
        setWord('')
      })
    } else {
      setWord('')
    }
  }

  const submitChar = async () => {
    console.log(`[User Action]: Submit character ${char}`)
    if (!context.isDebug) {
      await context.hangman.makeCharGuess(char, async () => {
        // getCorrectlyGuessedCharacters()
        // getUsedCharacters()
        setChar('')
      })
    } else {
      setChar('')
    }
  }

  return (
    <div className={classes.root}>
      <Grid container justify='center' spacing={1} alignItems='center' style={{ minHeight: '100vh' }}>

        <Grid item xs={6}>
          <Paper className={classes.paper}>
          <img className={classes.img} 
            src='https://d1nhio0ox7pgb.cloudfront.net/_img/i_collection_png/512x512/plain/guillotine.png'
          />
            <Typography>
              {displayWord}
            </Typography>
         </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Grid container justify='center' direction='column' spacing={1} alignItems='center' style={{ minHeight: '100vh' }}>
              <Typography>
                Guesses Left 50/50
              </Typography>

              <Typography>
                Used Characters: a b c d e f g h i j k l m n o p q r s t u v w x y z
              </Typography>

              <Grid container item direction='row' spacing={1} alignItems='center'>
                <Grid item>
                  <TextField id="outlined-basic" label="Guess Word" variant="outlined" value={word} onChange={handleWordGuessChange}/>
                </Grid>
                <Grid item>
                  <Button variant='contained' color='primary' onClick={submitWord}>Submit Word</Button>
                </Grid>
              </Grid>

              <Grid container item direction='row' spacing={1} alignItems='center'>
                <Grid item>
                  <TextField id="outlined-basic" label="Guess Character" variant="outlined" value={char} onChange={handleCharGuessChange}/>
                </Grid>
                <Grid item>
                  <Button variant='contained' color='primary' onClick={submitChar}>Submit Char</Button>
                </Grid>
              </Grid>

            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

export default GameScreen;
