const hre = require("hardhat");

async function main() {

  const cost = hre.ethers.parseEther("0.01");

  const NFT_sc = await hre.ethers.deployContract("NewTokenByStandart", ["baseURI"]);
  await NFT_sc.waitForDeployment();

  console.log(
    `NFT deployed to ${NFT_sc.target}`
  );
  
  let info = await NFT_sc.info();
  console.log(info);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
