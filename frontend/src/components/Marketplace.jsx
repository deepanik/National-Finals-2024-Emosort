
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import {
    Typography,
    Button,
    Box,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Snackbar,
    Alert,
    Divider,
} from '@mui/material';
import contractABI from './keys/DigitalFileMarketplaceABI.json';

const Marketplace = () => {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentAccount, setCurrentAccount] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [ownedNfts, setOwnedNfts] = useState([]);

    const CONTRACT_ADDRESS = '0x9790C431F0e5663A907c2494060C28FEC17E52f2'; // Replace with your contract address

    useEffect(() => {
        checkWalletConnection();
    }, []);

    const checkWalletConnection = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                setCurrentAccount(accounts[0]);
                await initContract();
            } else {
                showSnackbar('Please connect to MetaMask!', 'warning');
            }
        } else {
            showSnackbar('MetaMask not detected!', 'error');
        }
    };

    const initContract = async () => {
        if (window.ethereum) {
            try {
                const web3 = new Web3(window.ethereum);
                const nftContract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
                window.nftContract = nftContract;
                await fetchAvailableNFTs();
                await fetchOwnedNFTs();
            } catch (error) {
                showSnackbar('Failed to initialize contract: ' + error.message, 'error');
            }
        } else {
            showSnackbar('MetaMask not detected!', 'error');
        }
    };

    const fetchAvailableNFTs = async () => {
        setLoading(true);
        try {
            const result = await window.nftContract.methods.getAvailableNFTs().call(); // Ensure the correct method is called
            const tokenIds = result[0]; // Should be the array of token IDs
            const nftsData = result[1]; // This should contain the tuples

            // Log the result for debugging
            console.log('Token IDs fetched:', tokenIds);
            console.log('NFT data fetched:', nftsData);

            // Check if there are any token IDs
            if (tokenIds.length === 0) {
                showSnackbar('No NFTs available for sale.', 'info');
                return; // Exit if no NFTs are available
            }

            const nfts = nftsData.map((nftData, index) => ({
                name: nftData[0],
                ipfsHash: nftData[1],
                description: nftData[2],
                price: nftData[3].toString(),
                tokenId: tokenIds[index].toString(), // This may need adjustment if the token IDs don't match the index
                owner: nftData[5],
                isListed: nftData[6], // Adjust based on your data structure
            }));

            setNfts(nfts);
        } catch (error) {
            showSnackbar('Failed to fetch NFTs: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchOwnedNFTs = async () => {
        if (currentAccount) {
            setLoading(true);
            try {
                const [ownedTokenIds, ownedNFTsData] = await window.nftContract.methods.getUserNFTs(currentAccount).call();
                const ownedNFTs = ownedNFTsData.map((nftData, index) => ({
                    name: nftData[0],
                    ipfsHash: nftData[1],
                    description: nftData[2],
                    price: nftData[3].toString(),
                    tokenId: ownedTokenIds[index].toString(),
                    owner: currentAccount,
                    royalty: nftData[4].toString(),
                }));

                setOwnedNfts(ownedNFTs);
            } catch (error) {
                showSnackbar('Failed to fetch owned NFTs: ' + error.message, 'error');
            } finally {
                setLoading(false);
            }
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
            await window.nftContract.methods.buyNFT(tokenId).send({
                from: account,
                value: price,
            });

            showSnackbar('NFT purchased successfully!', 'success');
            fetchAvailableNFTs();
            fetchOwnedNFTs(); // Refresh owned NFTs after purchase
        } catch (error) {
            showSnackbar('Transaction failed: ' + error.message, 'error');
        }
    };

    const updateNFTPrice = async (tokenId, newPrice) => {
        try {
            await window.nftContract.methods.updateNFTPrice(tokenId, Web3.utils.toWei(newPrice.toString(), 'ether')).send({
                from: currentAccount,
            });

            showSnackbar('NFT price updated successfully!', 'success');
            fetchAvailableNFTs();
            fetchOwnedNFTs();
        } catch (error) {
            showSnackbar('Failed to update price: ' + error.message, 'error');
        }
    };

    const listNFT = async (tokenId) => {
        try {
            await window.nftContract.methods.listNFT(tokenId).send({ from: currentAccount });
            showSnackbar('NFT listed successfully!', 'success');
            fetchOwnedNFTs();
        } catch (error) {
            showSnackbar('Failed to list NFT: ' + error.message, 'error');
        }
    };

    const delistNFT = async (tokenId) => {
        try {
            await window.nftContract.methods.delistNFT(tokenId).send({ from: currentAccount });
            showSnackbar('NFT delisted successfully!', 'success');
            fetchOwnedNFTs();
        } catch (error) {
            showSnackbar('Failed to delist NFT: ' + error.message, 'error');
        }
    };

    const burnNFT = async (tokenId) => {
        try {
            await window.nftContract.methods.burnNFT(tokenId).send({ from: currentAccount });
            showSnackbar('NFT burned successfully!', 'success');
            fetchOwnedNFTs();
        } catch (error) {
            showSnackbar('Failed to burn NFT: ' + error.message, 'error');
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
            <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ fontFamily: 'monospace' }} // Change font to monospace
            >
                NFT Marketplace
            </Typography>
            {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', minHeight: '60vh' }}>
                    <CircularProgress color="inherit" />
                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                        Loading NFTs, please wait...
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {nfts.length > 0 ? (
                        nfts.map((nft, index) => (
                            <Grid item xs={12} sm={6} md={4} key={`${nft.tokenId}-${index}`}>
                                <Card sx={{ bgcolor: '#303030', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)', boxShadow: 10 } }}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6" className="neon-text">{nft.name}</Typography>
                                        <Typography variant="body2" className="neon-underline" sx={{ color: '#fff' }}>
                                            Price: {Web3.utils.fromWei(nft.price, 'ether')} ETH
                                        </Typography>
                                        <Divider sx={{ marginY: 1, bgcolor: 'white' }} />
                                        <Typography variant="body2">{nft.description}</Typography>
                                        <Divider sx={{ marginY: 1, bgcolor: 'white' }} />

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => buyNFT(nft.tokenId, nft.price)}
                                            sx={{ marginTop: 2, bgcolor: '#00ff00', '&:hover': { bgcolor: '#00cc00' } }} // Neon button colors
                                        >
                                            Buy NFT
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="h6" align="center">No NFTs available</Typography>
                        </Grid>
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
