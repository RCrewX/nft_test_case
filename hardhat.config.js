require("@nomicfoundation/hardhat-toolbox");
var keys = require("./keys.json"); 

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${keys.INFURA_API_KEY}`,
      accounts: [keys.SEPOLIA_PRIVATE_KEY]
    }
  }
};
