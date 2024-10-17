// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicNFT is ERC721 {
    uint256 public tokenCounter;

    constructor() ERC721("BasicNFT", "BNFT") {
        tokenCounter = 0;
    }

    // Function to mint a new NFT
    function mintNFT() public {
        _mint(msg.sender, tokenCounter);
        tokenCounter++;
    }

    // Function to buy an NFT (Assumes tokenId is available)
    function buyNFT(uint256 tokenId) public payable {
        require(msg.value > 0, "Payment required");
        address owner = ownerOf(tokenId);
        require(msg.sender != owner, "You already own this NFT");
        _transfer(owner, msg.sender, tokenId);
        payable(owner).transfer(msg.value);
    }
}
