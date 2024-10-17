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
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import contractABI from './keys/DigitalFileMarketplaceABI.json';

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
    const [encryptionPassword, setEncryptionPassword] = useState('');

    const CONTRACT_ADDRESS = '0x0b2c170f24657e1f2c25cc16d49b4b70120ecf18';

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
        formData.append('password', encryptionPassword); // Include the encryption password for MongoDB storage

        try {
            const response = await fetch('http://localhost:5000/uploadToIPFS', {
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

    // const saveNFTMetadata = async (metadata) => {
    //     try {
    //         const response = await fetch('http://localhost:5000/nfts', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(metadata),
    //         });

    //         const data = await response.json();
    //         if (!data.success) {
    //             throw new Error(data.error || 'Failed to save NFT metadata to MongoDB');
    //         }
    //     } catch (error) {
    //         showSnackbar('Error saving NFT metadata: ' + error.message, 'error');
    //     }
    // };
    const saveNFTMetadata = async (metadata) => {
        try {
            const response = await fetch('http://localhost:5000/nfts', {
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
            console.error('Error details:', error); // Log error details
            showSnackbar('Error saving NFT metadata: ' + error.message, 'error');
        }
    };
    

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (!contract) {
    //         showSnackbar('Contract is not initialized', 'error');
    //         return;
    //     }

    //     setLoading(true);

    //     try {
    //         const hash = await uploadFileToBackend();
    //         if (hash) {
    //             const priceInWei = Web3.utils.toWei(price, 'ether');
                
    //             // Minting the NFT without the password
    //             await contract.methods.createNFT(name, hash, priceInWei, description, royalty).send({ from: currentAccount });
    //             showSnackbar('NFT created successfully!', 'success');

    //             const metadata = {
    //                 name,
    //                 ipfsHash: hash,
    //                 price: priceInWei,
    //                 description,
    //                 royalty,
    //                 encryptionPassword,
    //                 creator: currentAccount,
    //             };
    //             await saveNFTMetadata(metadata);

    //             if (onNFTCreated) {
    //                 onNFTCreated(); 
    //             }

    //             // Reset form state
    //             setName('');
    //             setPrice('');
    //             setDescription('');
    //             setRoyalty('');
    //             setFile(null);
    //             encryptionPassword();
    //             setIpfsHash(hash);
    //         }
    //     } catch (error) {
    //         showSnackbar('Failed to create NFT: ' + error.message, 'error');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

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
                    encryptionPassword, // Ensure this is included correctly
                };
                await saveNFTMetadata(metadata);
    
                if (onNFTCreated) {
                    onNFTCreated(); 
                }
    
                // Reset form state
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
        accept: '*/*', // Accept all file types
    });

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#212121', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Fade in timeout={1000}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        Create Your NFT
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Start minting your unique digital asset
                    </Typography>
                    {!currentAccount ? (
                        <Button variant="contained" color="primary" onClick={connectWallet}>
                            Connect Wallet
                        </Button>
                    ) : (
                        <Typography variant="body1">Connected Account: {currentAccount}</Typography>
                    )}
                </Box>
            </Fade>

            <Grow in timeout={1200}>
                <Paper elevation={4} sx={{ padding: 3, backgroundColor: '#303030', width: '100%', maxWidth: 600 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        NFT Creation Form
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Name"
                            variant="outlined"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            sx={{ mb: 2, bgcolor: '#424242' }}
                            InputProps={{ sx: { color: '#fff' } }}
                        />
                        <TextField
                            fullWidth
                            label="IPFS Hash (auto-generated)"
                            variant="outlined"
                            value={ipfsHash}
                            required
                            disabled
                            sx={{ mb: 2, bgcolor: '#424242' }}
                            InputProps={{ sx: { bgcolor: '#424242', color: '#fff' } }}
                            InputLabelProps={{ sx: { color: '#fff' } }}
                        />
                        <TextField
                            fullWidth
                            label="Price (ETH)"
                            variant="outlined"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            type="number"
                            sx={{ mb: 2, bgcolor: '#424242' }}
                            InputProps={{ sx: { color: '#fff' } }}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            variant="outlined"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            multiline
                            rows={4}
                            sx={{ mb: 2, bgcolor: '#424242' }}
                            InputProps={{ sx: { color: '#fff' } }}
                        />
                        <TextField
                            fullWidth
                            label="Royalty Percentage"
                            variant="outlined"
                            value={royalty}
                            onChange={(e) => setRoyalty(e.target.value)}
                            required
                            type="number"
                            sx={{ mb: 2, bgcolor: '#424242' }}
                            InputProps={{ sx: { color: '#fff' } }}
                        />
                        <TextField
                            fullWidth
                            label="Encryption Password"
                            variant="outlined"
                            type="password"
                            value={encryptionPassword}
                            onChange={(e) => setEncryptionPassword(e.target.value)}
                            required
                            sx={{ mb: 2, bgcolor: '#424242' }}
                            InputProps={{ sx: { color: '#fff' } }}
                        />
                        <div {...getRootProps({ className: 'dropzone' })} style={{ padding: '20px', border: '2px dashed #3f51b5', borderRadius: '5px', cursor: 'pointer' }}>
                            <input {...getInputProps()} />
                            <p>{file ? `Selected file: ${file.name}` : 'Drag & drop some files here, or click to select files'}</p>
                        </div>
                        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                        <Button type="submit" variant="contained" color="primary" disabled={loading || !file}>
                            {loading ? <CircularProgress size={24} /> : 'Mint NFT'}
                        </Button>
                    </form>
                </Paper>
            </Grow>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

CreateNFT.propTypes = {
    onNFTCreated: PropTypes.func,
};

export default CreateNFT;
