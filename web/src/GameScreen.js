import React, { useContext, useState, useEffect } from 'react';	
import { Context } from './context';
import { Grid, Paper, Typography, Button, TextField } from '@material-ui/core';

function GameScreen(classes) {
  const [context, setContext] = useContext(Context);
  const [displayWord, setDisplayWord] = useState('');
  const [word, setWord] = useState('');
  const [char, setChar] = useState('');
  const [usedChars, setUsedChars] = useState([]);
  const [misses, setMisses] = useState(0);
  const [maxMisses, setMaxMisses] = useState(0);
  const [wordInputDisabled, setWordInputDisabled] = useState(false);
  const [charInputDisabled, setCharInputDisabled] = useState(false);
  const [submitWordDisabled, setSubmitWordDisabled] = useState(true);
  const [submitCharDisabled, setSubmitCharDisabled] = useState(true);
  const [gameStatus, setGameStatus] = useState("Game in Progress");

  console.log(`[UI GameScreen]: load`);

  useEffect(() => {
    const loadInitalData = async () => {
      const max = await context.hangman.maxAllowedMisses();
      const missesMade = await context.hangman.currentMisses();
      const result = await context.hangman.getCorrectlyGuessedChars();
      const usedChars = await context.hangman.getUsedChars();

      setMaxMisses(max);
      setMisses(missesMade);
      setUsedChars(usedChars);
      setDisplayWord(result);
    }
    // only load the current state if there we're not in debug
    if (!context.isDebug) {
      loadInitalData();
    }
  }, [])

  function handleWordGuessChange(e) {
    (e.target.value.length > 0) ?
      setSubmitWordDisabled(false) : setSubmitWordDisabled(true)
    setWord(e.target.value);
  }

  function handleCharGuessChange(e) {
    if (e.target.value.length === 0) {
      setSubmitCharDisabled(true)
      setChar(e.target.value);
    } else if (e.target.value.length === 1) { 
      setSubmitCharDisabled(false)
      setChar(e.target.value);
    }
  }

  const submitWord = async () => {
    console.log(`[User Action]: Submit word ${word}`);
    setSubmitWordDisabled(true);
    setSubmitCharDisabled(true);
    if (!context.isDebug) {
      await context.hangman.makeWordGuess(word, async () => {
        const missesMade = await context.hangman.currentMisses();
        const result = await context.hangman.getCorrectlyGuessedChars();
        
        if (!result.includes('_')) {
          setGameStatus("Game Win");
          setWordInputDisabled(true)
          setCharInputDisabled(true)
        } else if (parseInt(missesMade) === parseInt(maxMisses)) {
          setGameStatus("Game Lose");
          setWordInputDisabled(true)
          setCharInputDisabled(true)
        }

        setMisses(missesMade);
        setDisplayWord(result);
        setWord('');
      })
    } else {
      setWord('');
    }
  }

  const submitChar = async () => {
    console.log(`[User Action]: Submit character ${char}`);
    setSubmitWordDisabled(true);
    setSubmitCharDisabled(true);
    if (!context.isDebug) {
      await context.hangman.makeCharGuess(char, async () => {
        const result = await context.hangman.getCorrectlyGuessedChars();
        const usedChars = await context.hangman.getUsedChars();
        const missesMade = await context.hangman.currentMisses();
        
        if (!result.includes('_')) {
          setGameStatus("Game Win");
          setWordInputDisabled(true)
          setCharInputDisabled(true)
        } else if (parseInt(missesMade) === parseInt(maxMisses)) {
          setGameStatus("Game Lose");
          setWordInputDisabled(true)
          setCharInputDisabled(true)
        }

        setMisses(missesMade);
        setUsedChars(usedChars);
        setDisplayWord(result);
        setChar('');
      });
    } else {
      setChar('');
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
              {`${gameStatus}: ${displayWord}`}
            </Typography>
         </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Grid container justify='center' direction='column' spacing={1} alignItems='center' style={{ minHeight: '100vh' }}>
              <Typography>
                Guesses Used {misses + '/' + maxMisses}
              </Typography>

              <Typography>
                Used Characters: {usedChars}
              </Typography>

              <Grid container item direction='row' spacing={1} alignItems='center'>
                <Grid item>
                  <TextField id="outlined-basic" label="Guess Word" variant="outlined" disabled={wordInputDisabled} value={word} onChange={handleWordGuessChange}/>
                </Grid>
                <Grid item>
                  <Button variant='contained' color='primary' disabled={submitWordDisabled} onClick={submitWord}>Submit Word</Button>
                </Grid>
              </Grid>

              <Grid container item direction='row' spacing={1} alignItems='center'>
                <Grid item>
                  <TextField id="outlined-basic" label="Guess Character" variant="outlined" disabled={charInputDisabled} value={char} onChange={handleCharGuessChange}/>
                </Grid>
                <Grid item>
                  <Button variant='contained' color='primary' disabled={submitCharDisabled} onClick={submitChar}>Submit Char</Button>
                </Grid>
              </Grid>

            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
};

export default GameScreen;
