const express = require('express');
const NFT = require('../models/nftModel');
const router = express.Router();

router.post('/', async (req, res) => {
    const { ipfsHash, tokenId, transactionId } = req.body;

    try {
        const newNFT = new NFT({ ipfsHash, tokenId, transactionId });
        await newNFT.save();
        res.status(201).json({ message: 'NFT saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving NFT', error });
    }
});

module.exports = router;
