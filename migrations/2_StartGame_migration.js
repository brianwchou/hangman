const StartGame = artifacts.require("StartGame");

module.exports = function(deployer) {

  let chainlinkTokenAddress = 0x0000000000000000000000000000000000000000;
  let chainlinkOracleAddress = 0x0000000000000000000000000000000000000000;
  let url = "https://en.wikipedia.org/api/rest_v1/page/random/title";
  let path = "items[0].title";

  deployer.deploy(
    StartGame,
    chainlinkTokenAddress, 
    chainlinkOracleAddress, 
    url, 
    path
  );
};
