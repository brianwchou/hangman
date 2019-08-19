const HDWalletProvider = require("truffle-hdwallet-provider");

require('dotenv').config()  // Store environment-specific variable from '.env' to process.env

module.exports = {
  contracts_build_directory: "./web/src/contracts",
  networks: {
     development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },
     ropsten: {
     provider: () => new HDWalletProvider(
       process.env.MNENOMIC,
       "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY),
     network_id: 3,
     gas: 3000000,
     gasPrice: 10000000000
    }
  },

  mocha: {
    // timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.4.24",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      evmVersion: "constantinople"
      // }
    }
  }
}
