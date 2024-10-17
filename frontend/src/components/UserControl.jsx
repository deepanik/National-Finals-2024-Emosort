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
    Tooltip,
    createTheme,
    ThemeProvider,
    CssBaseline
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TransferIcon from '@mui/icons-material/Send';
import ApproveIcon from '@mui/icons-material/ThumbUp';
import SellIcon from '@mui/icons-material/AttachMoney';
import BurnIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
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

    const CONTRACT_ADDRESS = '0xCE80D0c8b2E6cdaBEc05fCd27fCFA66F9B95E630';
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
        const nftContract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
        try {
            const result = await nftContract.methods.transferFrom(currentAccount, recipientAddress, selectedTokenId).send({ from: currentAccount });
            showSnackbar(`NFT transferred successfully! Transaction hash: ${result.transactionHash}`, 'success');
        } catch (error) {
            showSnackbar('Transfer failed: ' + error.message, 'error');
        } finally {
            handleTransferDialogClose();
            await fetchUserNFTs(currentAccount);
        }
    };

    const approveNFT = async () => {
        const nftContract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
        try {
            const result = await nftContract.methods.approve(approvalAddress, selectedTokenId).send({ from: currentAccount });
            showSnackbar(`NFT approved successfully! Transaction hash: ${result.transactionHash}`, 'success');
        } catch (error) {
            showSnackbar('Approval failed: ' + error.message, 'error');
        } finally {
            handleApproveDialogClose();
        }
    };

    const sellNFT = async () => {
        const nftContract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
        try {
            const priceInWei = web3.utils.toWei(sellPrice, 'ether');
            const result = await nftContract.methods.sellNFT(selectedTokenId, priceInWei).send({ from: currentAccount });
            showSnackbar(`NFT listed for sale successfully! Transaction hash: ${result.transactionHash}`, 'success');
        } catch (error) {
            showSnackbar('Sale failed: ' + error.message, 'error');
        } finally {
            handleSellDialogClose();
            await fetchUserNFTs(currentAccount);
        }
    };

    const burnNFT = async () => {
        const nftContract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
        try {
            const result = await nftContract.methods.burn(selectedTokenId).send({ from: currentAccount });
            showSnackbar(`NFT burned successfully! Transaction hash: ${result.transactionHash}`, 'success');
        } catch (error) {
            showSnackbar('Burn failed: ' + error.message, 'error');
        } finally {
            handleBurnDialogClose();
            await fetchUserNFTs(currentAccount);
        }
    };

    const downloadFile = async (ipfsHash, fileName) => {
        try {
            const response = await fetch('http://localhost:5000/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ipfsHash }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                showSnackbar(errorData.message || 'Download failed', 'error');
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            showSnackbar('Failed to download file: ' + error.message, 'error');
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

    // Define the dark blue theme
    const darkBlueTheme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#0D47A1', // Dark blue primary color
            },
            background: {
                default: '#0A0A2A', // Dark blue background
                paper: '#1E1E3F', // Dark blue paper background
            },
            text: {
                primary: '#FFFFFF', // White text
            },
        },
    });

    return (
        <ThemeProvider theme={darkBlueTheme}>
            <CssBaseline />
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>Your NFTs</Typography>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>NFT Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>IPFS Hash</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {nfts.map((nft) => (
                                    <TableRow key={nft.tokenId}>
                                        <TableCell>{nft.name}</TableCell>
                                        <TableCell>{nft.description}</TableCell>
                                        <TableCell>
                                            <a href={`https://ipfs.io/ipfs/${nft.ipfsHash}`} target="_blank" rel="noopener noreferrer">
                                                {nft.ipfsHash}
                                            </a>
                                        </TableCell>
                                        <TableCell>{web3.utils.fromWei(nft.price, 'ether')} ETH</TableCell>
                                        <TableCell>
                                            <Tooltip title="Transfer">
                                                <IconButton color="primary" onClick={() => handleTransferDialogOpen(nft.tokenId)}>
                                                    <TransferIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Approve">
                                                <IconButton color="primary" onClick={() => handleApproveDialogOpen(nft.tokenId)}>
                                                    <ApproveIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Sell">
                                                <IconButton color="primary" onClick={() => handleSellDialogOpen(nft.tokenId)}>
                                                    <SellIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Burn">
                                                <IconButton color="primary" onClick={() => handleBurnDialogOpen(nft.tokenId)}>
                                                    <BurnIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Download">
                                                <IconButton color="primary" onClick={() => downloadFile(nft.ipfsHash, nft.name)}>
                                                    <DownloadIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Transfer Dialog */}
            <Dialog open={openTransferDialog} onClose={handleTransferDialogClose}>
                <DialogTitle>Transfer NFT</DialogTitle>
                <DialogContent>
                    <DialogContentText>Enter the recipient's address to transfer the NFT.</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Recipient Address"
                        fullWidth
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleTransferDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={transferNFT} color="primary">
                        Transfer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Approve Dialog */}
            <Dialog open={openApproveDialog} onClose={handleApproveDialogClose}>
                <DialogTitle>Approve NFT</DialogTitle>
                <DialogContent>
                    <DialogContentText>Enter the address to approve for this NFT.</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Approval Address"
                        fullWidth
                        value={approvalAddress}
                        onChange={(e) => setApprovalAddress(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleApproveDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={approveNFT} color="primary">
                        Approve
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Sell Dialog */}
            <Dialog open={openSellDialog} onClose={handleSellDialogClose}>
                <DialogTitle>Sell NFT</DialogTitle>
                <DialogContent>
                    <DialogContentText>Enter the sale price for this NFT in Ether.</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Price in ETH"
                        fullWidth
                        value={sellPrice}
                        onChange={(e) => setSellPrice(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSellDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={sellNFT} color="primary">
                        Sell
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Burn Dialog */}
            <Dialog open={openBurnDialog} onClose={handleBurnDialogClose}>
                <DialogTitle>Burn NFT</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to burn this NFT? This action cannot be undone.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleBurnDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={burnNFT} color="primary">
                        Burn
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
};

export default UserControl;
