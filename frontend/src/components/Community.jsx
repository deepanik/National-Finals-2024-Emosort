import React from 'react';
import { FaTwitter, FaInstagram, FaLinkedin, FaTelegram, FaFacebook } from 'react-icons/fa';

const Community = () => {
  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col justify-between relative"
      style={{
        backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzm8AIoYny6zE13l3Hf36VdP3HpnGX0c3W74_8Z4zvR5Wlliw8ZMhT9vTU1gyN8paVLi8&usqp=CAU')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      
      {/* Content Section */}
      <div className="relative mt-20 z-10">
        {/* Header Section */}
        <header className="flex justify-center py-12">
          <h1 className="text-4xl font-extrabold">JOIN OUR COMMUNITY</h1>
        </header>

        {/* Social Media Icons */}
        <div className="flex justify-center mt-10 space-x-6">
          <a href="https://linkedin.com" className="transition transform hover:scale-105">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded">
              <FaLinkedin className="text-gray-400 h-8 w-5 hover:text-blue-700 transition duration-300" />
            </div>
          </a>
          <a href="https://instagram.com" className="transition transform hover:scale-105">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded">
              <FaInstagram className="text-gray-400 h-8 w-5 hover:text-pink-500 transition duration-300" />
            </div>
          </a>
          <a href="https://twitter.com" className="transition transform hover:scale-105">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded">
              <FaTwitter className="text-gray-400 h-8 w-5 hover:text-blue-400 transition duration-300" />
            </div>
          </a>
          <a href="https://telegram.org" className="transition transform hover:scale-105">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded">
              <FaTelegram className="text-gray-400 h-8 w-5 hover:text-blue-500 transition duration-300" />
            </div>
          </a>
          <a href="https://facebook.com" className="transition transform hover:scale-105">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded">
              <FaFacebook className="text-gray-400 h-8 w-5 hover:text-blue-600 transition duration-300" />
            </div>
          </a>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="py-4 text-center relative z-10">
        <div className="text-sm">EncryptShare Copyright © 2024</div>
        <nav className="mt-2 space-x-4 text-gray-400">
          <a href="/" className="hover:text-white">Home</a>
          <a href="#about" className="hover:text-white">About</a>
          <a href="#phaseslider" className="hover:text-white">Roadmap</a>
          <a href="#team" className="hover:text-white">Team</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
        </nav>
      </footer>
    </div>
  );
};

export default Community;
