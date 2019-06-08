import React, { useState, useEffect, useContext } from 'react';
import { EthersContext, EthersContextProvider } from './EthersContext.js';
import Game from './Game.js';
import Start from './Start.js';

function App() {

  function ViewState() {
    const [ethersContext, setEthersContext] = useContext(EthersContext);
    return (
      <div>
        {(ethersContext.contract === undefined) ? <Start/> : <Game/>}
      </div>
    );
  }

  return (
    <EthersContextProvider>
      <ViewState/>
    </EthersContextProvider>
  );
}

export default App;
