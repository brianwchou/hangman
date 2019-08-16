## Hangman
Play hangman on the Ethereum network. 

Hangman is a game where a player has limited attempts to guess a secret word. The player is allowed to guess a letter contained in secret or guess the entire secret. Each incorrect guess uses an attempt. When all attempts have been made or if the word has been guessed correctly the game ends.

### Technical description
This project is centered around these two contracts: `StartGame.sol` and `Hangman.sol`. 
From the React frontend, the user deploys a StartGame instance. StartGame is a chainlinked contract that will provide a random word from the [Wikipedia](Wikipedia.org) API. After the word is fetched, startgame will deploy an instance of Hangman with the random word and return the contract address to the UI. A new game display appears with guessword input and letter inputs. A game overscreen appears when the word has been guessed or there are no more avaliable attempts.

### Local Setup
1. `npm install truffle -g`
2. `git clone git@github.com:brianwchou/Hangman.git`
3. `cd Hangman`
4. `yarn`
5. `yarn web:install`
5. `yarn truffle:compile`
5. `yarn truffle:migrate`
5. `yarn web:start`

### Tech Framework
- chainlink
- truffle
- ganache-cli
- gnosis mock-contract
- ganache-time-traveler
- react
- ethers.js

