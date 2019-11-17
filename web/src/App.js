import React, { useState, useEffect, useContext } from 'react';
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
    <ViewState/>
  );
}

export default App;
