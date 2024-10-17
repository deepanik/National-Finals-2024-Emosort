import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import metamask from './Images/metamask_logo.jpeg.jpg';
import remix from './Images/remix_logo.jpeg.jpg';
import contract from './Images/contract.jpeg';
import solidity1 from './Images/solidity1.jpg';

const NFTCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  const images = [metamask, remix, contract, solidity1];

  return (
    <div  className="bg-black text-white overflow-x-hidden">
      <Slider {...settings} className="w-full"> {/* Ensure full width of the slider */}
        {images.map((image, index) => (
          <div key={index} className="p-4">
            <img 
              src={image} 
              alt={`NFT ${index}`} 
              className="w-full h-48 object-cover rounded-lg" 
            />
          </div>
        ))}
      </Slider>
      <div className="mt-8 text-center bg-slate-900 grid grid-cols-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold">1000</h2>
          <p>Total Items</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold">600</h2>
          <p>Total Owners</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold">0.10</h2>
          <p>Floor Price (ETH)</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold">100K</h2>
          <p>Volume Traded (ETH)</p>
        </div>
      </div>
    </div>
  );
};

export default NFTCarousel;
