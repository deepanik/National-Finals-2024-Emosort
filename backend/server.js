// Import required packages
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a schema for NFT metadata
const nftSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ipfsHash: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    royalty: { type: Number, required: true },
    owner: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const NFT = mongoose.model('NFT', nftSchema);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/uploadToIPFS', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: 'No file received' });
        }

        // Save the file to a temporary location
        const fileName = `temp_${file.originalname}`;
        const filePath = path.join(__dirname, fileName);
        fs.writeFileSync(filePath, file.buffer);

        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));

        // Pinata API endpoint for uploading files to IPFS
        const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

        // Hardcoded Pinata API headers
        const headers = {
            ...formData.getHeaders(),
            pinata_api_key: '954ccb5f78f3dee79078',           // Hardcoded API Key
            pinata_secret_api_key: '4c50abf672cb63711f350307b79f4a23da2ceec84849b01be03d458d80bf1992' // Hardcoded Secret API Key
        };

        // Make the request to Pinata
        const response = await axios.post(url, formData, { headers });

        // Clean up the temporary file
        fs.unlinkSync(filePath);

        // Send IPFS hash back to client
        res.status(200).json({
            success: true,
            ipfsHash: response.data.IpfsHash,
        });

    } catch (error) {
        console.error('Error uploading to IPFS:', error.message);
        res.status(500).json({ success: false, message: 'IPFS upload failed', error: error.message });
    }
});


// Route to create and save NFT metadata
app.post('/nfts', async (req, res) => {
    const { name, ipfsHash, price, description, royalty, creator } = req.body;

    try {
        // Convert price and royalty to Number
        const priceNumber = parseFloat(price);
        const royaltyNumber = parseFloat(royalty);

        // Check for NaN values
        if (isNaN(priceNumber) || isNaN(royaltyNumber)) {
            return res.status(400).json({ success: false, message: 'Price and royalty must be valid numbers' });
        }

        // Create new NFT document
        const newNFT = new NFT({ 
            name, 
            ipfsHash, 
            price: priceNumber, 
            description, 
            royalty: royaltyNumber,
            owner: creator 
        });

        // Save to MongoDB
        await newNFT.save();

        res.status(201).json({ success: true, message: 'NFT metadata saved successfully!' });
    } catch (error) {
        console.error('Error saving NFT metadata:', error);
        res.status(500).json({ success: false, error: 'Failed to save NFT metadata', details: error.message });
    }
});

app.post('/download', async (req, res) => {
    const { ipfsHash } = req.body;
    const PINATA_GATEWAY_URL = 'https://ipfs.io/ipfs/';

    if (!ipfsHash) {
        return res.status(400).json({ message: 'IPFS hash is required.' });
    }

    try {
        // Construct the URL to access the file via the Pinata gateway
        const fileUrl = `${PINATA_GATEWAY_URL}${ipfsHash}`;
        
        // Fetch the file from Pinata
        const response = await axios({
            method: 'get',
            url: fileUrl,
            responseType: 'arraybuffer', // Important for downloading binary data
        });

        // Set appropriate headers for file download
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${ipfsHash}.file"`,
        });

        // Send the file data as the response
        return res.send(response.data);
    } catch (error) {
        console.error('Error downloading from Pinata:', error.message);
        return res.status(500).json({ message: 'Failed to download file from Pinata.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
