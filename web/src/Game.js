import React from 'react';

export default function Game() {

  return (
    <div>
      <input
          type = "text"
          name = "character"
          placeholder = "character"
      />
      <button type="button">Guess Character</button>
      <br />

      <input
          type = "text"
          name = "character"
          placeholder = "word"
      />
      <button type="button">Guess Word</button>
      <br />
    </div>
  );
}

