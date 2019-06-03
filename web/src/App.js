import React, { useState, useEffect, useContext } from 'react';
import { EthersContextProvider } from './EthersContext.js';
import Game from './Game.js';
import Start from './Start.js';

function App() {
  return (
    <EthersContextProvider>
      <Start/>
      <Game/>
    </EthersContextProvider>
  );
}

export default App;
