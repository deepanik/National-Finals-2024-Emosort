import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import {
    Typography,
    Button,
    Box,
    Grid,
    Paper,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import contractABI from './keys/DigitalFileMarketplaceABI.json';

const Marketplace = () => {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentAccount, setCurrentAccount] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const CONTRACT_ADDRESS = '0x94a2d6471EE4885938C0da6cD76103548865fcB6'; // Replace with your contract address

    useEffect(() => {
        checkWalletConnection();
        initContract();
    }, []);

    const checkWalletConnection = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                setCurrentAccount(accounts[0]);
                fetchAvailableNFTs();
            } else {
                showSnackbar('Please connect to MetaMask!', 'warning');
            }
        } else {
            showSnackbar('MetaMask not detected!', 'error');
        }
    };

    const initContract = async () => {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            const nftContract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
            window.nftContract = nftContract;
            await fetchAvailableNFTs();
        } else {
            showSnackbar('MetaMask not detected!', 'error');
        }
    };

    const fetchAvailableNFTs = async () => {
        setLoading(true);
        try {
            // Call the smart contract function
            const result = await window.nftContract.methods.getAvailableNFTs().call();
    
            // Log the full result for debugging
            console.log('Result from getAvailableNFTs:', result);
    
            // Destructure the result safely
            const tokenIds = result[0]; // This should be the uint256[] array
            const nftsData = result[1]; // This should be the tuple[] array
    
            // Check if the returned values are arrays
            if (!Array.isArray(tokenIds) || !Array.isArray(nftsData)) {
                throw new Error('getAvailableNFTs did not return two arrays.');
            }
    
            // Ensure both tokenIds and nftsData are arrays and have the same length
            if (tokenIds.length !== nftsData.length) {
                throw new Error('Returned data arrays do not match in length.');
            }
    
            // Map through the returned tuples to create NFT objects
            const nfts = nftsData.map((nftData, index) => ({
                name: nftData[0], // NFT name
                ipfsHash: nftData[1], // IPFS hash
                description: nftData[2], // NFT description
                price: nftData[3].toString(), // NFT price in wei
                tokenId: tokenIds[index].toString(), // Corresponding token ID
                owner: nftData[5], // NFT owner address
            }));
    
            console.log('Mapped NFTs:', nfts);
            setNfts(nfts);
        } catch (error) {
            showSnackbar('Failed to fetch NFTs: ' + error.message, 'error');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const buyNFT = async (tokenId, price) => {
        if (!window.ethereum) {
            showSnackbar('Please install MetaMask!', 'warning');
            return;
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];

        try {
            const response = await window.nftContract.methods.buyNFT(tokenId).send({
                from: account,
                value: price.toString(), // Make sure price is in the correct format (wei)
            });

            console.log("NFT purchased successfully:", response);
            showSnackbar('NFT purchased successfully!', 'success');
            // Optionally, refresh the NFT list or update state here
            fetchAvailableNFTs(); // Refresh the list of NFTs
        } catch (error) {
            console.error("Error purchasing NFT:", error);
            showSnackbar('Transaction failed: ' + error.message, 'error');
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#212121', color: '#fff', padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Marketplace
            </Typography>
            {loading ? (
                <CircularProgress color="inherit" />
            ) : (
                <Grid container spacing={3}>
                    {nfts.length > 0 ? (
                        nfts.map((nft) => (
                            <Grid item xs={12} sm={6} md={4} key={nft.tokenId}>
                                <Paper sx={{ padding: 2, bgcolor: '#303030' }}>
                                    <Typography variant="h6">{nft.name}</Typography>
                                    <Typography variant="body2">
                                        Price: {Web3.utils.fromWei(nft.price, 'ether')} ETH
                                    </Typography>
                                    <Typography variant="body2">
                                        Description: {nft.description}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ marginTop: 2 }}
                                        onClick={() => buyNFT(nft.tokenId, nft.price)} // Call buyNFT with tokenId and price
                                    >
                                        Buy NFT
                                    </Button>
                                </Paper>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="h6">No NFTs available</Typography>
                    )}
                </Grid>
            )}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Marketplace;
