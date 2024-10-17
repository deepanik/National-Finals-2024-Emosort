import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../components/Images/logo1.jpeg'; // Adjust the path as needed

const Navbar = ({ walletConnected, connectWallet }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Added snackbarMessage state
  const [snackbarType, setSnackbarType] = useState(''); // Added snackbarType state

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.classList.toggle('overflow-hidden', !isMobileMenuOpen); // Prevent background scroll
  };

  return (
    <div className="bg-gray-900 text-white"> {/* Removed min-h-screen */}
      {/* Snackbar for notifications */}
      {snackbarMessage && (
        <div className={`fixed bottom-4 right-4 bg-${snackbarType === 'error' ? 'red' : 'green'}-600 text-white px-4 py-2 rounded`}>
          {snackbarMessage}
        </div>
      )}

      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-slate-800 shadow-lg' : 'bg-gray-900 shadow-lg'
        } py-4 px-4 flex justify-between items-center`}
      >
        {/* Logo and Website Name */}
        <div className="flex items-center">
          <img src={logoImg} alt="Website Logo" className="w-10 h-10 mr-2" />
          <div className="text-3xl font-bold">Encrypt Share</div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-4">
          <li>
            <Link to="/" className="hover:text-blue-500">
              Home
            </Link>
          </li>
          <li>
            <a href="#about" className="hover:text-blue-500">
              About
            </a>
          </li>
          <li>
            <Link to="/createNFT" className="hover:text-blue-500">
              Create NFT
            </Link>
          </li>
          <li>
            <Link to="/Marketplace" className="hover:text-blue-500">
              Marketplace
            </Link>
          </li>
          <li>
            <Link to="/UserControl" className="hover:text-blue-500">
              UserControl
            </Link>
          </li>
          <li>
            <a href="#phaseslider" className="hover:text-blue-500">
              Roadmap
            </a>
          </li>
          <li>
            <a href="#team" className="hover:text-blue-500">
              Team
            </a>
          </li>
          <li>
            <a href="#faq" className="hover:text-blue-500">
              FAQ
            </a>
          </li>
        </ul>

        {/* Wallet Button (Desktop) */}
        {!walletConnected ? (
          <button
            onClick={connectWallet}
            className="hidden md:block bg-blue-600 px-4 py-2 rounded text-white"
          >
            Connect Wallet
          </button>
        ) : (
          <span className="hidden md:block text-green-400">Wallet Connected</span>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-16 right-0 w-full bg-gray-800 text-white p-4">
            <ul className="space-y-4 text-center">
              <li>
                <Link to="/" className="block hover:text-blue-500">
                  Home
                </Link>
              </li>
              <li>
                <a href="#about" className="block hover:text-blue-500">
                  About
                </a>
              </li>
              <li>
                <Link to="/createNFT" className="block hover:text-blue-500">
                  Create NFT
                </Link>
              </li>
              <li>
                <a href="#phaseslider" className="block hover:text-blue-500">
                  Roadmap
                </a>
              </li>
              <li>
                <a href="#team" className="block hover:text-blue-500">
                  Team
                </a>
              </li>
              <li>
                <a href="#faq" className="block hover:text-blue-500">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
