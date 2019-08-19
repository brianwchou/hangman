getWeb3 = () => {
  //purposefully don't use truffle's web3
  var Web3 = require('web3');
  //ganache cli as provider
  let provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
  var web3 = new Web3(provider);
  return web3;
}

module.exports = {
  getWeb3
}
