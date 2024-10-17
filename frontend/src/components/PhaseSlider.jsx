import React, { useRef, useEffect } from 'react';

const PhaseSlider = () => {
  const phases = [
    { title: 'Research & design', description: 'This phase involved comprehensive research into the NFT ecosystem and designing a platform that allows users to mint NFTs with encrypted files. We developed a user-friendly interface and crafted a secure architecture to ensure that only NFT owners can decrypt and download their files.', status: 'Completed' },
    { title: 'Development', description: 'This phase focuses on building the core functionalities of the DApp, including frontend development, smart contracts, MetaMask integration, and the encryption system for NFTs.', status: 'Complete' },
    { title: 'Mint NFT', description: 'This phase will introduce the NFT minting feature, enabling users to upload files, encrypt them, and mint them as NFTs. These NFTs will be linked to the encrypted files stored on a decentralized network, ensuring that only the NFT owner can decrypt and access the original file.', status: 'Completed' },
    { title: 'Listing', description: 'Listing the minted NFTs on decentralized marketplaces, providing visibility to potential buyers and collectors. This will open up trading possibilities.', status: 'Completed' },
    // { title: 'Marketing', description: 'Details about marketing and promotion phase...' },
    // { title: 'Launch', description: 'Complete launch phase description here...' },
    // { title: 'Partnerships', description: 'Collaborating with key partners to enhance the project...' },
    { title: 'Growth', description: 'Focus on scaling the features of Platform, optimizing performance. This phase is involved continuous development.', status: 'Ongoing' },
  ];

  const sliderRef = useRef(null);
  let isDragging = false;
  let startPos = 0;
  let scrollLeft = 0;

  useEffect(() => {
    // Clone the first few items at the end of the slider to create the infinite loop effect
    const slider = sliderRef.current;
    const clone = slider.innerHTML;
    slider.innerHTML += clone; // Duplicate the phases at the end

    // Handle the loopback when the scroll reaches the end
    slider.addEventListener('scroll', () => {
      const maxScrollLeft = slider.scrollWidth / 2; // Halfway point (since content is duplicated)
      if (slider.scrollLeft >= maxScrollLeft) {
        slider.scrollLeft = 0; // Loop back to the start
      }
    });
  }, []);

  // Mouse events for drag-to-slide effect
  const handleMouseDown = (e) => {
    isDragging = true;
    startPos = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft = sliderRef.current.scrollLeft;
    sliderRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startPos) * 2; // scroll-fast multiplier
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    isDragging = false;
    sliderRef.current.style.cursor = 'grab';
  };

  const handleMouseLeave = () => {
    isDragging = false;
    sliderRef.current.style.cursor = 'grab';
  };

  return (
    <div id="phaseslider" className=" mt-10 text-white py-10">
      <div className="w-full">
          <div
          ref={sliderRef}
          className="flex space-x-6 md:space-x-2 px-6 md:px-16 overflow-x-hidden cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {phases.map((phase, index) => (
            <div key={index} className="min-w-[300px] md:min-w-[250px] lg:min-w-[400px] p-6">
              <h3 className="text-blue-700  font-bold mb-2">
                PHASE {`0${index + 1}`} ✓
              </h3>
              <h4 className="text-lg font-bold mb-4">
                {phase.title}
              </h4>
              <p className="font-mono text-gray-300">
                {phase.description}
              </p>
            </div>
          ))}
          {/* Duplicating phases for infinite scroll effect */}
          {phases.map((phase, index) => (
            <div key={index + phases.length} className="min-w-[300px] md:min-w-[250px] lg:min-w-[400px] p-6">
              <h3 className="text-blue-400 text-lg font-semibold mb-2">
                PHASE {index + 1} ✓
              </h3>
              <h4 className="text-2xl font-bold mb-4">
                {phase.title}
              </h4>
              <p className="text-sm text-gray-300">
                {phase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhaseSlider;
