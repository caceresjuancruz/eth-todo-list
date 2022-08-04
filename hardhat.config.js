require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "rinkeby",
  networks: {
    hardhat: {
    },
    rinkeby: {
      url: process.env.API_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  solidity: "0.8.9",
};
