import React, { useState, createContext } from 'react';

const Context = createContext([{}, () => {}]);

const Provider = (props) => {
  const [state, setState] = useState({});
  return (
    <Context.Provider value={[state, setState]}>
      {props.children}
    </Context.Provider>
  );
}

export { Context, Provider };
