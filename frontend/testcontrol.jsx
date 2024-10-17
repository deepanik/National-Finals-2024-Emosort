import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Snackbar,
    Alert,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    IconButton,
    Paper,
    Grid,
    Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TransferIcon from '@mui/icons-material/Send';
import ApproveIcon from '@mui/icons-material/ThumbUp';
import SellIcon from '@mui/icons-material/AttachMoney';
import BurnIcon from '@mui/icons-material/Delete';
import contractABI from './keys/DigitalFileMarketplaceABI.json';

const UserControl = () => {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentAccount, setCurrentAccount] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [openTransferDialog, setOpenTransferDialog] = useState(false);
    const [openApproveDialog, setOpenApproveDialog] = useState(false);
    const [openSellDialog, setOpenSellDialog] = useState(false);
    const [openBurnDialog, setOpenBurnDialog] = useState(false);
    const [selectedTokenId, setSelectedTokenId] = useState(null);
    const [recipientAddress, setRecipientAddress] = useState('');
    const [approvalAddress, setApprovalAddress] = useState('');
    const [sellPrice, setSellPrice] = useState('');
    
    const CONTRACT_ADDRESS = '0x470B8408f413Ae80d06f760B2dBFc55Da457c564';
    const web3 = new Web3(window.ethereum);

    useEffect(() => {
        checkWalletConnection();
    }, []);

    const checkWalletConnection = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                setCurrentAccount(accounts[0]);
                await fetchUserNFTs(accounts[0]);
            } else {
                showSnackbar('Please connect to MetaMask!', 'warning');
            }
        } else {
            showSnackbar('MetaMask not detected!', 'error');
        }
    };

    const fetchUserNFTs = async (account) => {
        setLoading(true);
        if (window.ethereum) {
            const nftContract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
            try {
                const result = await nftContract.methods.getUserNFTs(account).call();
                const tokenIds = result[0];
                const nftsData = result[1];

                if (Array.isArray(tokenIds) && tokenIds.length > 0 && Array.isArray(nftsData)) {
                    const nfts = nftsData.map((nft, index) => ({
                        tokenId: tokenIds[index].toString(),
                        name: nft[0],
                        ipfsHash: nft[1],
                        description: nft[2],
                        price: nft[3].toString(),
                    }));
                    setNfts(nfts);
                } else {
                    showSnackbar('No NFTs found for this account.', 'info');
                }
            } catch (error) {
                showSnackbar('Failed to fetch NFTs: ' + error.message, 'error');
            } finally {
                setLoading(false);
            }
        } else {
            showSnackbar('MetaMask not detected!', 'error');
        }
    };

    const transferNFT = async () => {
        // Handle NFT transfer logic
        // ...
    };

    const approveNFT = async () => {
        // Handle NFT approval logic
        // ...
    };

    const sellNFT = async () => {
        // Handle NFT sale logic
        // ...
    };

    const burnNFT = async () => {
        // Handle NFT burn logic
        // ...
    };

    const downloadFile = (ipfsHash, fileName) => {
        // Handle file download logic
        // ...
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleTransferDialogOpen = (tokenId) => {
        setSelectedTokenId(tokenId);
        setOpenTransferDialog(true);
    };

    const handleTransferDialogClose = () => {
        setOpenTransferDialog(false);
        setRecipientAddress('');
    };

    const handleApproveDialogOpen = (tokenId) => {
        setSelectedTokenId(tokenId);
        setOpenApproveDialog(true);
    };

    const handleApproveDialogClose = () => {
        setOpenApproveDialog(false);
        setApprovalAddress('');
    };

    const handleSellDialogOpen = (tokenId) => {
        setSelectedTokenId(tokenId);
        setOpenSellDialog(true);
        setSellPrice(''); // Reset sell price
    };

    const handleSellDialogClose = () => {
        setOpenSellDialog(false);
        setSellPrice('');
    };

    const handleBurnDialogOpen = (tokenId) => {
        setSelectedTokenId(tokenId);
        setOpenBurnDialog(true);
    };

    const handleBurnDialogClose = () => {
        setOpenBurnDialog(false);
    };

    return (
        <Box sx={{ bgcolor: '#212121', color: '#fff', padding: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
                Your NFTs
            </Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                    <CircularProgress color="inherit" />
                </Box>
            ) : nfts.length === 0 ? (
                <Box display="flex" flexDirection="column" alignItems="center" height="400px">
                    <Typography variant="h6">No NFTs found for this account.</Typography>
                    <Typography variant="body1">Make sure you own NFTs in this marketplace.</Typography>
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {nfts.map((nft) => (
                        <Grid item xs={12} sm={6} md={4} key={nft.tokenId}>
                            <Paper elevation={3} sx={{ padding: 2, borderRadius: 2, backgroundColor: '#424242' }}>
                                <Typography variant="h6">NFT NAME: {nft.name}</Typography>
                                <Typography variant="body2">Discription: {nft.description}</Typography>
                                <Typography variant="body1">Price: {web3.utils.fromWei(nft.price, 'ether')} ETH</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                                    <Tooltip title="Download File" arrow>
                                        <Button onClick={() => downloadFile(nft.ipfsHash, nft.name)} variant="outlined" color="primary">
                                            Download
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Transfer NFT" arrow>
                                        <Button onClick={() => handleTransferDialogOpen(nft.tokenId)} variant="contained" color="secondary">
                                            <TransferIcon />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Approve NFT" arrow>
                                        <Button onClick={() => handleApproveDialogOpen(nft.tokenId)} variant="contained" color="info">
                                            <ApproveIcon />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Sell NFT" arrow>
                                        <Button onClick={() => handleSellDialogOpen(nft.tokenId)} variant="contained" color="success">
                                            <SellIcon />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Burn NFT" arrow>
                                        <Button onClick={() => handleBurnDialogOpen(nft.tokenId)} variant="contained" color="error">
                                            <BurnIcon />
                                        </Button>
                                    </Tooltip>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
            {/* Transfer Dialog */}
            <Dialog open={openTransferDialog} onClose={handleTransferDialogClose}>
                <DialogTitle>Transfer NFT</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the recipient's address to transfer NFT #{selectedTokenId}.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Recipient Address"
                        type="text"
                        fullWidth
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleTransferDialogClose}>Cancel</Button>
                    <Button onClick={transferNFT} color="primary">Transfer</Button>
                </DialogActions>
            </Dialog>
            {/* Approve Dialog */}
            <Dialog open={openApproveDialog} onClose={handleApproveDialogClose}>
                <DialogTitle>Approve NFT</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the address to approve for NFT #{selectedTokenId}.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Approval Address"
                        type="text"
                        fullWidth
                        value={approvalAddress}
                        onChange={(e) => setApprovalAddress(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleApproveDialogClose}>Cancel</Button>
                    <Button onClick={approveNFT} color="primary">Approve</Button>
                </DialogActions>
            </Dialog>
            {/* Sell Dialog */}
            <Dialog open={openSellDialog} onClose={handleSellDialogClose}>
                <DialogTitle>Sell NFT</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Set the price for NFT #{selectedTokenId} (in ETH).
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Sell Price (ETH)"
                        type="number"
                        fullWidth
                        value={sellPrice}
                        onChange={(e) => setSellPrice(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSellDialogClose}>Cancel</Button>
                    <Button onClick={sellNFT} color="primary">Sell</Button>
                </DialogActions>
            </Dialog>
            {/* Burn Dialog */}
            <Dialog open={openBurnDialog} onClose={handleBurnDialogClose}>
                <DialogTitle>Burn NFT</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to burn NFT #{selectedTokenId}? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleBurnDialogClose}>Cancel</Button>
                    <Button onClick={burnNFT} color="error">Burn</Button>
                </DialogActions>
            </Dialog>
            {/* Snackbar for feedback */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UserControl;
