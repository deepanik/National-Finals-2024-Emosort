import React from 'react';

const HowItWorks = () => {
  return (
    <div className="py-16 px-10" style={{ background: 'linear-gradient(180deg, #000C1F 0%, #000 100%)' }} >
      {/* EASY STEPS */}
      <div className="flex justify-start items-center mb-2">
        <h2 className="text-blue-500 text-sm uppercase tracking-wide mr-2">Easy Steps</h2>
        <div className="h-1 w-8 bg-blue-500"></div> {/* Thin bar next to "Easy Steps" */}
      </div>

      {/* HOW IT WORK */}
      <div className="mb-16">
        <h1 className="text-left text-5xl font-extrabold tracking-tight text-white">HOW IT WORKS</h1>
      </div>

      {/* Steps Section */}
      <div className="grid grid-cols-4 gap-8 text-center">
        <div>
          <h2 className="text-6xl font-extrabold mb-4 text-white">𝟙</h2>
          <p className="text-lg font-semibold text-gray-300">Connect Your Wallet</p>
        </div>
        <div>
          <h2 className="text-6xl font-extrabold mb-4 text-white">𝟚</h2>
          <p className="text-lg font-semibold text-gray-300">Create NFT / Buy NFT</p>
        </div>
        <div>
          <h2 className="text-6xl font-extrabold mb-4 text-white">𝟛</h2>
          <p className="text-lg font-semibold text-gray-300">Receive Your Encrpted NFT.</p>
        </div>
        <div>
          <h2 className="text-6xl font-extrabold mb-4 text-white">𝟜</h2>
          <p className="text-lg font-semibold text-gray-300">Decrypt</p>
        </div>
        <div>
          <h2 className="text-6xl font-extrabold mb-4 text-white">𝟝</h2>
          <p className="text-lg font-semibold text-gray-300">Transfer</p>
        </div>
        <div>
          <h2 className="text-6xl font-extrabold mb-4 text-white">𝟞</h2>
          <p className="text-lg font-semibold text-gray-300">Approve</p>
        </div>
        <div>
          <h2 className="text-6xl font-extrabold mb-4 text-white">7</h2>
          <p className="text-lg font-semibold text-gray-300">Sell NFT</p>
        </div>
        <div>
          <h2 className="text-6xl font-extrabold mb-4 text-white">8</h2>
          <p className="text-lg font-semibold text-gray-300">Burn NFT</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
