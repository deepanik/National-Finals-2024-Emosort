// models/NFT.js
const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ipfsHash: { type: String, required: true },
    price: { type: Number, required: true }, // Changed to Number
    description: { type: String, required: true },
    royalty: { type: Number, required: true }, // Changed to Number
    // passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NFT', nftSchema);
