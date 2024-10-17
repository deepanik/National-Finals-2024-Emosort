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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TransferIcon from '@mui/icons-material/Send';
import ApproveIcon from '@mui/icons-material/ThumbUp';
import SellIcon from '@mui/icons-material/AttachMoney';
import BurnIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import contractABI from './keys/DigitalFileMarketplaceABI.json';

const encryptedTheme = {
    backgroundColor: '#121212', // Dark background
    color: 'DodgerBlue', // Red text color for the whole app
    borderColor: '#00FFDD', // Neon border for elements
    hoverColor: '#00FFC6', // Slightly different neon color for hover effects
    dialogBackground: '#1F1F1F', // Darker dialog background
    buttonBackground: '#00FFDD', // Neon button background
    buttonHover: '#00FFC6', // Button hover effect
    buttonText: '#000', // Button text color
};

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

    const CONTRACT_ADDRESS = '0x8d7435Df48B0f6DFc8e83A2f51014438Ccb42033';
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

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{ backgroundColor: encryptedTheme.backgroundColor, color: encryptedTheme.color, minHeight: '100vh', padding: '2rem' }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'monospace', color: encryptedTheme.color }}>
                Your NFTs
            </Typography>
            {loading ? (
                <CircularProgress sx={{ color: encryptedTheme.color }} />
            ) : (
                <TableContainer component={Paper} sx={{ backgroundColor: encryptedTheme.dialogBackground }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontFamily: 'monospace', color: encryptedTheme.color }}>NFT Name</TableCell>
                                <TableCell sx={{ fontFamily: 'monospace', color: encryptedTheme.color }}>Description</TableCell>
                                <TableCell sx={{ fontFamily: 'monospace', color: encryptedTheme.color }}>IPFS Hash</TableCell>
                                <TableCell sx={{ fontFamily: 'monospace', color: encryptedTheme.color }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {nfts.map((nft) => (
                                <TableRow key={nft.tokenId}>
                                    <TableCell sx={{ fontFamily: 'monospace', color: encryptedTheme.color }}>{nft.name}</TableCell>
                                    <TableCell sx={{ fontFamily: 'monospace', color: encryptedTheme.color }}>{nft.description}</TableCell>
                                    <TableCell sx={{ fontFamily: 'monospace', color: encryptedTheme.color }}>{nft.ipfsHash}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Download">
                                            <IconButton sx={{ color: encryptedTheme.color }}>
                                                <DownloadIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Transfer">
                                            <IconButton sx={{ color: encryptedTheme.color }}>
                                                <TransferIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Approve">
                                            <IconButton sx={{ color: encryptedTheme.color }}>
                                                <ApproveIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Sell">
                                            <IconButton sx={{ color: encryptedTheme.color }}>
                                                <SellIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Burn">
                                            <IconButton sx={{ color: encryptedTheme.color }}>
                                                <BurnIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UserControl;
