import React, { useState } from 'react';

export default function Game() {

  const [hangmanString, setHangmanString] = useState("");

  return (
    <div>
     { hangmanString }
      <br />
      <input
          type = "text"
          name = "character"
          placeholder = "character"
      />&nbsp;
      <button type="button">Guess Character</button>
      <br />

      <input
          type = "text"
          name = "character"
          placeholder = "word"
      />&nbsp;
      <button type="button">Guess Word</button>
      <br />
    </div>
  );
}

