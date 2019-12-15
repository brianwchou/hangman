import React, { useContext } from 'react';
import { Context } from './context';
import StartScreen from './StartScreen.js';
import GameScreen from './GameScreen.js';

function App() {
  const [context, setContext] = useContext(Context);

  return (
    <div>
      <StartScreen />
    </div>
  );
}

export default App;
