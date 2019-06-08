import React from 'react';

export default function GuessCounter(props) {
  if (props.numerator === 0 && props.denominator === 0) {
    //if num and denom are 0 then we haven't loaded, don't show anything
    return null;
  } else {
    return (
      <div>
        { props.numerator } of { props.denominator } misses left
      </div>
    );
  } 
}