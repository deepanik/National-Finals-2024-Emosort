import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import {
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoadingButton from '@mui/lab/LoadingButton';
import contractABI from './keys/DigitalFileMarketplaceABI.json';

const Marketplace = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const CONTRACT_ADDRESS = '0xCE80D0c8b2E6cdaBEc05fCd27fCFA66F9B95E630';

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
        alert('Please connect to MetaMask!');
      }
    } else {
      alert('MetaMask not detected!');
    }
  };

  const initContract = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        const nftContract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
        window.nftContract = nftContract;
        await fetchAvailableNFTs();
      } catch (error) {
        alert('Failed to initialize contract: ' + error.message);
      }
    } else {
      alert('MetaMask not detected!');
    }
  };

  const fetchAvailableNFTs = async () => {
    setLoading(true);
    try {
      const result = await window.nftContract.methods.getAvailableNFTs().call();
      const tokenIds = result[0];
      const nftsData = result[1];

      const nfts = nftsData.map((nftData, index) => ({
        name: nftData[0],
        price: nftData[3].toString(),
        tokenId: tokenIds[index].toString(),
        owner: nftData[5],
        // Use RoboHash to generate a random avatar based on the tokenId
        imageUrl: `https://robohash.org/${tokenIds[index]}?set=set1&size=200x200`,
      }));

      setNfts(nfts);
    } catch (error) {
      alert('Failed to fetch NFTs: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const buyNFT = async (tokenId, price) => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    try {
      setBuying(true); // Show loading indicator
      await window.nftContract.methods.buyNFT(tokenId).send({
        from: account,
        value: price,
      });

      alert('NFT purchased successfully!');
      fetchAvailableNFTs();
      setOpenSnackbar(true); // Show Snackbar feedback
    } catch (error) {
      alert('Transaction failed: ' + error.message);
    } finally {
      setBuying(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#121212', color: '#fff', padding: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'monospace', textAlign: 'center' }}>
        NFT Marketplace
      </Typography>
      {loading ? (
        <Box className="flex items-center justify-center min-h-[60vh]">
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <Grid container spacing={3} className="justify-center">
          {nfts.map((nft, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                className="transform transition-transform hover:scale-105 shadow-lg"
                sx={{
                  backgroundColor: '#1a1a1a',
                  borderRadius: '12px',
                  padding: '16px',
                  height: '100%',
                }}
              >
                <Box className="relative overflow-hidden rounded-lg">
                  <img
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </Box>
                <CardContent className="text-center">
                  <Typography
                    variant="body2"
                    className="text-gray-300"
                    sx={{ fontWeight: 'bold', marginTop: 1 }}
                  >
                    {nft.name}
                  </Typography>
                  <Divider sx={{ backgroundColor: '#333', marginY: 1 }} />
                  <Typography variant="body2" className="text-white">
                    {Web3.utils.fromWei(nft.price, 'ether')} ETH
                  </Typography>
                  <Box className="flex justify-between items-center mt-2">
                    <Tooltip title="Buy this NFT" arrow>
                      <LoadingButton
                        loading={buying}
                        variant="contained"
                        onClick={() => buyNFT(nft.tokenId, nft.price)}
                        className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
                        loadingPosition="start"
                        startIcon={<ShoppingCartIcon />}
                      >
                        Buy Now
                      </LoadingButton>
                    </Tooltip>
                    <Tooltip title="Add to Favorites" arrow>
                      <IconButton sx={{ color: '#FF4081' }}>
                        <FavoriteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        message="NFT purchased successfully!"
        autoHideDuration={3000}
      />
    </Box>
  );
};

export default Marketplace;
