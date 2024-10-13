const HDWalletProvider = require("truffle-hdwallet-provider");
const fs = require("fs");
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    inf_riotest_rinkeby: {
      network_id: 4,
      gasPrice: 100000000000,
      provider: new HDWalletProvider(fs.readFileSync('/Users/roman/Documents/re.env', 'utf-8'), "https://rinkeby.infura.io/v3/b79a6ed363d742818b9413dfe0516361")
    },
    inf_riotest_ropsten: {
      network_id: 3,
      gasPrice: 100000,
      provider: new HDWalletProvider(fs.readFileSync('/Users/roman/Documents/re.env', 'utf-8'), "https://ropsten.infura.io/v3/b79a6ed363d742818b9413dfe0516361")
    }
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  }
};
