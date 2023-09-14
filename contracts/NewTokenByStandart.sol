// contracts/NewToken.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NewTokenByStandart is ERC721, Ownable {

    address[] public whitelist;
    mapping (address=>bool) public whitemap;

    bool public active = true;

    string public baseURI; 

    constructor(string memory bURI) ERC721("NewTokenST", "NEWTOKST") {
        baseURI = bURI;
    }

    modifier onlyActive() {
        require(active, "Not available now");
        _;
    }

    function addToWhitelist(address member) public onlyOwner() {
        require(!whitemap[member], "Member already in the whitelist");
        whitelist.push(member);
        whitemap[member] = true;
    }

    function removeFromWhitelist(address member) public {
        require(whitemap[member], "Member already not in the whitelist");

        for (uint256 index = 0; index < whitelist.length; index++) {
            if (member == whitelist[index]) {
                whitelist[index] = whitelist[whitelist.length - 1];
                whitelist.pop();
                return;
            }            
        }
        whitemap[member] = false;
    }

    function mintNewNFT(address to, uint256 tokenId) public payable onlyActive() {
        if (!whitemap[msg.sender]) {
            require(msg.value == 0.01 ether , "0.01 ether is required");
        }
        _safeMint(to, tokenId);
    }

    function withdraw() public onlyOwner() {
        address payable to = payable(msg.sender);
        to.transfer(address(this).balance);
    }

    function adminMintNewNFT(address to, uint256 tokenId) public onlyOwner() {
        _safeMint(to, tokenId); 
    }

    function adminMintNewNFTBatch(address to, uint256[] calldata tokenIds) public onlyOwner() {
        for (uint256 index = 0; index < tokenIds.length; index++) {
            _safeMint(to, tokenIds[index]); 
        }
    }

    function changeStatus(bool _active) public onlyOwner() {
        require(active != _active, 'Contract already in that status');
        active = _active;
    }

    function forceSendNFT(address to, uint256 tokenId) public onlyOwner() {
        // No such realization if using ERC721 standart
        // Need to use "transferFrom"/"safeTransferFrom" for correct transfer
    }

    function AllWhitelist() view public returns (address[] memory) {
        return whitelist;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function info() public view returns(string memory, string memory, string memory) {
        return (name(), symbol(), _baseURI());
    }

}