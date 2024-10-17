import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import {
    Typography,
    TextField,
    Button,
    Box,
    Fade,
    Grow,
    Paper,
    Snackbar,
    Alert,
    CircularProgress,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import contractABI from './keys/DigitalFileMarketplaceABI.json';
import Navbar from './Navbar'; // Import the Navbar component

const CreateNFT = ({ onNFTCreated }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [royalty, setRoyalty] = useState('');
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [currentAccount, setCurrentAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [ipfsHash, setIpfsHash] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [errorMessage, setErrorMessage] = useState('');

    const CONTRACT_ADDRESS = '0xCE80D0c8b2E6cdaBEc05fCd27fCFA66F9B95E630';

    useEffect(() => {
        checkWalletConnection();
        initContract();
    }, []);

    const checkWalletConnection = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                setCurrentAccount(accounts[0]);
            }
        }
    };

    const initContract = async () => {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            const nftContract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
            setContract(nftContract);
        } else {
            showSnackbar('MetaMask not detected!', 'error');
        }
    };

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setCurrentAccount(accounts[0]);
            } catch (error) {
                showSnackbar('Failed to connect wallet', 'error');
            }
        } else {
            showSnackbar('MetaMask not found. Please install it.', 'error');
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size <= 3 * 1024 * 1024) {
                setFile(selectedFile);
                setErrorMessage('');
            } else {
                setErrorMessage('File must be less than or equal to 3MB');
            }
        }
    };

    const uploadFileToBackend = async () => {
        if (!file) return '';

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('https://hackindia-2024-emosort.onrender.com/uploadToIPFS', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                return data.ipfsHash;
            } else {
                throw new Error(data.error || 'IPFS upload failed');
            }
        } catch (error) {
            showSnackbar('Error uploading to IPFS: ' + error.message, 'error');
            return '';
        }
    };

    const saveNFTMetadata = async (metadata) => {
        try {
            const response = await fetch('https://hackindia-2024-emosort.onrender.com/nfts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(metadata),
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error || 'Failed to save NFT metadata to MongoDB');
            }
        } catch (error) {
            console.error('Error details:', error);
            showSnackbar('Error saving NFT metadata: ' + error.message, 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!contract) {
            showSnackbar('Contract is not initialized', 'error');
            return;
        }

        setLoading(true);

        try {
            const hash = await uploadFileToBackend();
            if (hash) {
                const priceInWei = Web3.utils.toWei(price, 'ether');
                await contract.methods.createNFT(name, hash, priceInWei, description, royalty).send({ from: currentAccount });
                showSnackbar('NFT created successfully!', 'success');

                const metadata = {
                    name,
                    ipfsHash: hash,
                    price: priceInWei,
                    description,
                    royalty,
                    creator: currentAccount,
                };
                await saveNFTMetadata(metadata);

                if (onNFTCreated) {
                    onNFTCreated();
                }

                setName('');
                setPrice('');
                setDescription('');
                setRoyalty('');
                setFile(null);
                setIpfsHash(hash);
            }
        } catch (error) {
            showSnackbar('Failed to create NFT: ' + error.message, 'error');
        } finally {
            setLoading(false);
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

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            const selectedFile = acceptedFiles[0];
            if (selectedFile && selectedFile.size <= 3 * 1024 * 1024) {
                setFile(selectedFile);
                setErrorMessage('');
            } else {
                setErrorMessage('File must be less than or equal to 3MB');
            }
        },
        accept: '*/*',
    });

    return (
        <>
            <Navbar />
            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: '#121212',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 4,
                    paddingTop: '80px',
                }}
            >
                <Fade in timeout={1000}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography
                            variant="h3"
                            gutterBottom
                            sx={{ fontWeight: 600, color: 'white', fontFamily: 'monospace' }} // Monospace font for heading
                        >
                            Create Your NFT
                        </Typography>
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{ color: '#BDBDBD', fontFamily: 'monospace' }} // Monospace font for subheading
                        >
                            Mint your unique digital asset easily
                        </Typography>
                        {!currentAccount ? (
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    bgcolor: '#1976d2',
                                    borderRadius: '8px',
                                    padding: '10px 20px',
                                    '&:hover': { bgcolor: '#1565c0' },
                                }}
                                onClick={connectWallet}
                            >
                                Connect Wallet
                            </Button>
                        ) : (
                            <Box
                                sx={{
                                    display: 'inline-block',
                                    bgcolor: '#424242', // Background color for connected account
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    color: '#ffffff',
                                    mt: 2,
                                }}
                            >
                                Connected Account: {currentAccount}
                            </Box>
                        )}
                    </Box>
                </Fade>

                <Grow in timeout={1200}>
                    <Paper
                        elevation={6}
                        sx={{
                            padding: 4,
                            backgroundColor: 'grey', // Form background set to red
                            color: 'white',
                            maxWidth: 600,
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                variant="outlined"
                                InputLabelProps={{ style: { color: '#ffffff' } }} // White label text
                                InputProps={{
                                    style: { color: '#ffffff' }, // White input text
                                }}
                                sx={{
                                    mb: 3,
                                    bgcolor: '#424242',
                                    borderRadius: '8px',
                                }}
                            />
                            <TextField
                                fullWidth
                                label="IPFS Hash"
                                value={ipfsHash}
                                disabled
                                InputLabelProps={{ style: { color: '#ffffff' } }} // White label text
                                InputProps={{
                                    style: { color: '#ffffff' }, // White input text
                                }}
                                sx={{
                                    mb: 3,
                                    bgcolor: '#424242',
                                    borderRadius: '8px',
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Price (in ETH)"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                variant="outlined"
                                InputLabelProps={{ style: { color: '#ffffff' } }} // White label text
                                InputProps={{
                                    style: { color: '#ffffff' }, // White input text
                                }}
                                sx={{
                                    mb: 3,
                                    bgcolor: '#424242',
                                    borderRadius: '8px',
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                multiline
                                minRows={3}
                                variant="outlined"
                                InputLabelProps={{ style: { color: '#ffffff' } }} // White label text
                                InputProps={{
                                    style: { color: '#ffffff' }, // White input text
                                }}
                                sx={{
                                    mb: 3,
                                    bgcolor: '#424242',
                                    borderRadius: '8px',
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Royalty (in %)"
                                value={royalty}
                                onChange={(e) => setRoyalty(e.target.value)}
                                required
                                variant="outlined"
                                InputLabelProps={{ style: { color: '#ffffff' } }} // White label text
                                InputProps={{
                                    style: { color: '#ffffff' }, // White input text
                                }}
                                sx={{
                                    mb: 3,
                                    bgcolor: '#424242',
                                    borderRadius: '8px',
                                }}
                            />

                            {errorMessage && <Typography color="error">{errorMessage}</Typography>}

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    mb: 3,
                                    bgcolor: '#424242',
                                    borderRadius: '8px',
                                    height: '150px',
                                    border: '2px dashed #ffffff',
                                    cursor: 'pointer',
                                    '&:hover': { borderColor: '#1976d2' },
                                }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <Typography color="#BDBDBD">
                                    {file ? `Selected File: ${file.name}` : 'Drag and drop file here, or click to select file (Max: 3MB)'}
                                </Typography>
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    bgcolor: '#1976d2',
                                    borderRadius: '8px',
                                    padding: '10px 20px',
                                    '&:hover': { bgcolor: '#1565c0' },
                                }}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Create NFT'}
                            </Button>
                        </form>
                    </Paper>
                </Grow>

                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </>
    );
};

CreateNFT.propTypes = {
    onNFTCreated: PropTypes.func,
};

export default CreateNFT;
