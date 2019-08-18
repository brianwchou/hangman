const HangmanFactory = artifacts.require("HangmanFactory");

module.exports = function(deployer) {

  //ROPSTEN TESTNET ADDRESSES
  const chainlinkTokenAddress = "0x20fE562d797A42Dcb3399062AE9546cd06f63280";
  const chainlinkOracleAddress = "0xc99B3D447826532722E41bc36e644ba3479E4365";
  const url = "https://en.wikipedia.org/api/rest_v1/page/random/title";
  const path = "items[0].title";

  await deployer.deploy(
    HangmanFactory,
    chainlinkTokenAddress, 
    chainlinkOracleAddress, 
    url, 
    path
  );

//  //can be moved to tests
//  //this will create a new hangman game and wait for the response
//  let hangmanFactory = await HangmanFactory.deployed();
//  const jobId = "96bf1a27492142b095a8ada21631ebd0";
//  hangmanFactory.requestCreateCame(___, 1);
//
//  //listen for the event and grab the id
//  let requestId;
//
//  //Poll the blockchain to determine when the game has been created
//  let game = hangmanFactory.requestIdToGame(requestId);
//
//  //check that the game works.
};
