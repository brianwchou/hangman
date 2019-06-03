import React, { useState } from 'react';

const EthersContext = React.createContext([{}, () => {}]);

const EthersContextProvider = (props) => {
  const [state, setState] = useState({});

  return (
    <EthersContext.Provider value={[state, setState]}>
      {props.children}
    </EthersContext.Provider>
  );
}

export { EthersContext, EthersContextProvider };
