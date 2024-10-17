import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Web3 from 'web3';
import homeImg from './Images/homeImg.png';
import backgroundImg from './Images/homebg.avif'; // Import background image
import logoImg from './Images/logo1.jpeg'; // Import the logo image
import contractABI from './keys/DigitalFileMarketplaceABI.json';

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [availableNFTs, setAvailableNFTs] = useState([]); // Ensure this is initialized as an empty array
  const [userNFTs, setUserNFTs] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success'); // 'success', 'error', 'warning'


  const contractAddress = '0x8d7435Df48B0f6DFc8e83A2f51014438Ccb42033'; // Replace with your contract address

  // // Detect scroll position to add a shadow when scrolling
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 50) {
  //       setIsScrolled(true);
  //     } else {
  //       setIsScrolled(false);
  //     }
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  // // Toggle mobile menu visibility
  // const toggleMobileMenu = () => {
  //   setIsMobileMenuOpen(!isMobileMenuOpen);
  // };


  
  // Detect scroll position to add a shadow when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Connect wallet using web3.js
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWeb3(web3Instance);
        setWalletConnected(true);

        // Create contract instance
        const nftContract = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContract(nftContract);

        // Fetch available NFTs
        fetchAvailableNFTs(nftContract);
        fetchUserNFTs(nftContract); // Fetch the user's NFTs
      } else {
        showSnackbar('Please install MetaMask!', 'warning');
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  // Fetch available NFTs
  const fetchAvailableNFTs = async (contract) => {
    try {
      const available = await contract.methods.getAvailableNFTs().call();
      // Ensure the fetched data is an array
      if (Array.isArray(available)) {
        setAvailableNFTs(available);
      } else {
        console.error('Expected available NFTs to be an array', available);
      }
    } catch (error) {
      console.error('Error fetching available NFTs:', error);
    }
  };

  // Fetch user's NFTs
  // const fetchUserNFTs = async (contract) => {
  //   try {
  //     const accounts = await web3.eth.getAccounts();
  //     const userAddress = accounts[0];
  //     const userNFTs = await contract.methods.getUserNFTs(userAddress).call();
  //     setUserNFTs(userNFTs);
  //   } catch (error) {
  //     console.error('Error fetching user NFTs:', error);
  //   }
  // };

  // Fetch user's NFTs
const fetchUserNFTs = async (contract) => {
  try {
    // Ensure web3 is initialized
    if (!web3) {
      console.error('Web3 is not initialized. Please connect your wallet first.');
      return;
    }

    // Get user address
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];

    // Fetch the balance of NFTs owned by the user
    const balance = await contract.methods.balanceOf(userAddress).call();
    console.log(`User balance: ${balance}`); // Log user balance

    // Update the userNFTs state with the total number owned
    setUserNFTs(parseInt(balance, 10)); // Set as number (3 in this case)

    // Optionally, you can fetch the specific NFT IDs if needed:
    // const userOwnedNFTs = await getUserOwnedNFTs(userAddress); // Implement this if you have a function to get NFT IDs
    // setUserNFTs(userOwnedNFTs);

  } catch (error) {
    console.error('Error fetching user NFTs:', error);
  }
};

  


  // Snackbar function to show messages
  const showSnackbar = (message, type) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setTimeout(() => {
      setSnackbarMessage('');
    }, 3000); // Hide snackbar after 3 seconds
  };

  // Buy NFT function
  const buyNFT = async (tokenId, price) => {
    if (!window.ethereum) {
      showSnackbar('Please install MetaMask!', 'warning');
      return;
    }

    // Ensure price is valid
    if (!price || price <= 0) {
      showSnackbar('Invalid price!', 'error');
      return;
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    try {
      // Optionally estimate gas
      const gasEstimate = await contract.methods.buyNFT(tokenId).estimateGas({ from: account, value: price });
      
      await contract.methods.buyNFT(tokenId).send({
        from: account,
        value: price,
        gas: gasEstimate,
      });

      showSnackbar('NFT purchased successfully!', 'success');
      fetchAvailableNFTs(contract);
      fetchUserNFTs(contract); // Refresh owned NFTs after purchase
    } catch (error) {
      showSnackbar('Transaction failed: ' + error.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Snackbar for notifications */}
      {snackbarMessage && (
        <div className={`fixed bottom-4 right-4 bg-${snackbarType === 'error' ? 'red' : 'green'}-600 text-white px-4 py-2 rounded`}>
          {snackbarMessage}
        </div>
      )}


      

      {/* Hero Section with Background Image */}
      <section
        className="py-20 mt-16 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-slate-800 bg-opacity-60 py-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
            {/* Image on the left for larger screens */}
            <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center md:justify-start">
              <div className="bg-gray-800 border-4 border-blue-500 p-4 rounded-lg">
                <img
                  src={homeImg}
                  alt="NFT Hero"
                  className="w-64 md:w-80 mx-auto md:mx-0"
                />
              </div>
            </div>

            {/* Text and Buttons */}
            <div className="text-center md:text-left md:w-1/2 text-white">
              <h1 className="text-5xl font-bold">
                Encrypt Share BASE NFT COLLECTIONS
              </h1>
              <p className="text-xl mt-4">{userNFTs.length} / {availableNFTs.length + userNFTs.length} Minted</p>
              <div className="flex justify-center md:justify-start mt-8">
              <button onClick={connectWallet} className="bg-blue-600 px-4 py-2 rounded mx-2">Connect Wallet</button>
                {/* <button onClick={() => mintRandomNFT()} className="bg-green-600 px-4 py-2 rounded mx-2">Mint Random NFT</button> */}
              {/* <Link to="/CreateNFT" className="bg-green-600 px-4 py-2 rounded mx-2">Mint Now</Link> */}
              <button><Link to="/createNFT" className="bg-green-600 px-4 py-2 rounded mx-2">
            MINT NFT
          </Link></button>
              </div>
                           {/* Display available NFTs and allow purchasing */}
                           <div className="mt-8">
                {Array.isArray(availableNFTs) && availableNFTs.map((nft, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg mb-4">
                    <h2 className="text-xl font-semibold">NFT ID: {nft.id}</h2>
                    <p>Price: {web3.utils.fromWei(nft.price, 'ether')} ETH</p>
                    <button onClick={() => buyNFT(nft.id, nft.price)} className="bg-blue-600 px-4 py-2 rounded">Buy NFT</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;