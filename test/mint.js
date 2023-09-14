const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const cost = hre.ethers.parseEther("0.01");
 describe("NFT", function () {
    async function deployNFT() {
      const [owner, otherAccount] = await ethers.getSigners();
  
      const NFT = await ethers.getContractFactory("NewTokenByStandart");
      const baseURI = "MegaBaseURI";
      const nft = await NFT.deploy(baseURI);
  
      return { nft, baseURI, owner, otherAccount };
    }
  
    describe("Deployment", function () {
      it("Should set the right baseURI", async function () {
        const { nft, baseURI, owner, otherAccount } = await loadFixture(deployNFT);
  
        expect(await nft.baseURI()).to.equal(baseURI);
      });
  
      it("Should set the right owner", async function () {
        const { nft, baseURI, owner, otherAccount } = await loadFixture(deployNFT);
  
        expect(await nft.owner()).to.equal(owner.address);
      });
    });

    // describe("Mint", function() {
    //     it("", async function () {

    //     });
    // });

    describe("Mint", function() {
        it("Mint without whitelist", async function () {
            const { nft, baseURI, owner, otherAccount } = await loadFixture(deployNFT);
            await nft.mintNewNFT(owner, 0, { value: cost });
            expect(await nft.ownerOf(0)).to.equal(owner.address);
        });

        it("Mint with whitelist", async function () {
            const { nft, baseURI, owner, otherAccount } = await loadFixture(deployNFT);
            await nft.addToWhitelist(otherAccount.address);
            await nft.connect(otherAccount).mintNewNFT(otherAccount.address, 1);
            expect(await nft.ownerOf(1)).to.equal(otherAccount.address);
        });

        it("Mint as admin", async function () {
            const { nft, baseURI, owner, otherAccount } = await loadFixture(deployNFT);

            await nft.adminMintNewNFT(otherAccount.address, 2);
            expect(await nft.ownerOf(2)).to.equal(otherAccount.address);
        });

        it("Mint Batch", async function () {
            const { nft, baseURI, owner, otherAccount } = await loadFixture(deployNFT);

            const ids = [3,4,5,6];
            await nft.adminMintNewNFTBatch(otherAccount.address, ids);
            for (let index = 0; index < ids.length; index++) {
                expect(await nft.ownerOf(ids[index])).to.equal(otherAccount.address);
                
            }
            
        });
    });
});
  