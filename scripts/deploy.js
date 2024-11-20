// hardhat.config.js
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: process.env.GOERLI_RPC_URL, // Use your Infura or Alchemy Goerli RPC URL
      accounts: [process.env.PRIVATE_KEY], // Your wallet private key
    },
    // Add other networks if needed
  },
};
