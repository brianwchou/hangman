const HangmanFactory = artifacts.require("HangmanFactory");

module.exports = async function(deployer) {

  //ROPSTEN TESTNET ADDRESSES
  const chainlinkTokenAddress = "0x20fE562d797A42Dcb3399062AE9546cd06f63280";
  const chainlinkOracleAddress = "0xc99B3D447826532722E41bc36e644ba3479E4365";
  const url = "https://en.wikipedia.org/api/rest_v1/page/random/title";
  const path = "items[0].title";

//  await deployer.deploy(
//    HangmanFactory,
//    chainlinkTokenAddress, 
//    chainlinkOracleAddress, 
//    url, 
//    path
//  );
};
