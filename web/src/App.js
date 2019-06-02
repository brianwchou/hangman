import React from 'react';
import logo from './logo.svg';
import './App.css';
import Game from './Game.js';

const HangmanContext = React.createContext("gamestate");

function App() {
  return (
    <HangmanContext.Provider>
      <div>
        <button type="button">Start Game</button>
        <Game/>
      </div>
    </HangmanContext.Provider>
  );
}

export default App;
