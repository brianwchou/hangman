import React, { useState } from 'react';

const EthersContext = React.createContext([{}, () => {}]);

const EthersContextProvider = (props) => {
  const [state, setState] = useState({});
  console.log("EthersContext:",state);
  return (
    <EthersContext.Provider value={[state, setState]}>
      {props.children}
    </EthersContext.Provider>
  );
}

export {EthersContext, EthersContextProvider};
