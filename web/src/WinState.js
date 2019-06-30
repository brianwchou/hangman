import React from 'react';

export default function WinState(props) {
  const { winState } = props;
  if (winState > 0) {
    return (<div>Game Won!</div>);
  } else if(winState < 0) {
    return (<div>Game Lost</div>);
  } else {
    return null;
  }
}