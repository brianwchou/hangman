const Hangman = artifacts.require("Hangman");
const ethers = require("ethers");

module.exports = async function(deployer) {

  await deployer.deploy(
    Hangman
  );
  
  let instance = await Hangman.deployed()

  await instance.setSolution(ethers.utils.toUtf8Bytes("hello"), 5);
};

