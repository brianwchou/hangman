## Hangman
Play hangman on the Ethereum network. 

Hangman is a game where a player has limited attempts to guess a secret word. The player is allowed to guess a letter contained in the secret or guess the entire secret. Each incorrect guess uses an attempt. When all attempts have been made or if the word has been guessed correctly the game ends.

### Technical description
This project is centered around these two contracts: `HangmanFactory.sol` and `Hangman.sol`. 
HangmanFactory is a Chainlink Client that will fetch a random word from the [Wikipedia](https://en.wikipedia.org/api/rest_v1/page/random/title) API. After the word is fetched, the factory will deploy an instance of Hangman with the random word and return the contract address to the UI. A new game display appears with guessword and letter inputs. A game over screen appears when the word has been guessed or there are no more avaliable attempts.

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
- ipfs

### Contracts
```javascript
 +  HangmanFactory (ChainlinkClient, Ownable)
    - [Pub] <Constructor> #
    - [Pub] requestCreateGame #
    - [Pub] fullfillCreateGame #
    - [Prv] bytes32ToBytes
    - [Pub] withdrawLink #
    - [Pub] setUrl #
    - [Pub] cancelRequest #

 +  Hangman (Ownable)
    - [Ext] setSolution #
    - [Ext] getUsedCharacters
    - [Ext] makeCharGuess #
    - [Prv] computeGuess
    - [Ext] makeWordGuess #
    - [Ext] getNumberOfCharacters
    - [Ext] getCorrectlyGuessedCharacters
    - [Prv] hasBitAtIndex

 ($) = payable function
 # = non-constant function
```

### Running Unit Tests
```
yarn test
```

### Running Integration Tests
Make sure you have `.env` file set up
```
MNEMONIC=""
INFURA_API_KEY=""
```
Then run:
```
yarn test-integration --network ropsten
```
If there is a failure check
```
//ROPSTEN TESTNET ADDRESS
const chainlinkTokenAddress = "0x20fE562d797A42Dcb3399062AE9546cd06f63280";
const chainlinkOracleAddress = "0xc99B3D447826532722E41bc36e644ba3479E4365";
const CHAINLINK_HTTP_GET_JSON_PARSE_JOB_ID = "76ca51361e4e444f8a9b18ae350a5725";
const PAYMENT = 1;
```
https://ropsten.explorer.chain.link/

### Deployment
register ethereum name on [ENS](https://ens.domains/)
requires ipfs
`cd ./web # locate webfiles`
`yarn build # build your static files`
`ipfs add -r build/`
```
# EXAMPLE output
added QmYXMA1W6jX33hEKt6wARNjBJAKpXwXi84L9sfpSH93mD1 build/asset-manifest.json
added QmcFc6EPhavNSfdjG8byaxxV6KtHZvnDwYXLHvyJQPp3uN build/favicon.ico
added QmaTUS9hhSA5hcaLQLym4aPpKTmnTqWaLTteHA6hMAyTGi build/index.html
...
added QmWwswmrfNVJzatRkEtuf8LZFZUqbNuqzsiwDy4CAjHKfJ build/static/css
added QmenAh3Tx51Ju9bjWVCyZpwG81TyMTbpJiDVU1JRYXB119 build/static/js
added QmfK7ag3kUNHedX4Wqj7QG7UDP84RjEBcpUESzPy4rTqzF build/static
added QmaHNhLf89FacunsrZDpHBSvZ8khsm5seCBNJBy8tqHEKr build
 2.87 MiB / 2.87 MiB [======================================================================================================] 100.00%
```
take last hash displayed and add it to content
```Followed directions [here](https://medium.com/the-ethereum-name-service/how-to-host-your-dapp-with-ipfs-ens-and-access-it-via-ethdns-c96046059d87)```

upload may take some time to propagate and be available.
