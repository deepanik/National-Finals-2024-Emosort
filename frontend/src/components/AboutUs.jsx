import React, { useState, useEffect } from 'react';
import nft from './Images/nftabout.jpeg';
import meta from './Images/metaabout.jpeg';
import web3 from './Images/web3.jpeg';

const AboutUs = () => {
  // Image sources stored in an array
  const images = [nft, meta, web3];

  // State to track the current image order
  const [imageOrder, setImageOrder] = useState([0, 1, 2]);

  useEffect(() => {
    // Shuffle images every 3 seconds
    const interval = setInterval(() => {
      setImageOrder((prevOrder) => {
        const newOrder = [...prevOrder];
        const first = newOrder.shift(); // Remove the first image
        newOrder.push(first); // Add the first image to the end
        return newOrder;
      });
    }, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="about" className="bg-black text-white py-16 px-10">
      <h2 className="text-blue-500 text-xl font-semibold mb-4">THE STORY</h2>
      <h1 className="text-4xl font-bold mb-8">ABOUT US</h1>
      <div className="md:flex">
        <div className="md:w-1/2">
        <p className="text-lg leading-relaxed mb-8">
            We are Team Emosort, a passionate group of B.Tech students from Chitkara University. Our enthusiasm for cutting-edge technologies drives us to continuously learn and innovate. Through our active participation in hackathons, we challenge ourselves to develop creative solutions that make a meaningful impact in the tech community.
          </p>
          <p className="text-lg leading-relaxed">
            Our journey began with a shared vision to leverage technology for positive change. We believe that by embracing new ideas and collaborating with like-minded individuals, we can create products that enhance user experiences and redefine possibilities in the digital landscape.
          </p>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 flex justify-center items-center md:ml-10 mt-10 md:mt-0 relative">
          <div className="relative w-64 h-64">
            {/* Display images based on their current order */}
            <img
              src={images[imageOrder[0]]}
              alt="Image 1"
              className="rounded-lg shadow-lg w-full h-full absolute z-30 transform rotate-[-5deg] transition-transform duration-1000"
            />
            <img
              src={images[imageOrder[1]]}
              alt="Image 2"
              className="rounded-lg shadow-lg w-full h-full absolute z-20 transform rotate-[25deg] transition-transform duration-1000"
            />
            <img
              src={images[imageOrder[2]]}
              alt="Image 3"
              className="rounded-lg shadow-lg w-full h-full absolute z-10 transform rotate-[-10deg] transition-transform duration-1000"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
