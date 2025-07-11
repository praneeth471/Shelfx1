import React from 'react';
import Upload from "../assets/upload.png";
import Hand from "../assets/hand.png";
import Price from "../assets/price.png"

const Roles = () => {
  return (
    <div className="bg-[#222831] py-16 px-4 text-center ">
      <h2 className="text-4xl tracking-tight font-extrabold text-white mb-16">What You Can Do on ShelfX</h2>
      <div className="flex flex-wrap justify-center gap-8">
        <div className="bg-[#393E46] rounded-lg p-6 shadow-lg w-80 text-left card">
          <img src={Upload} alt="Upload Book" className="w-50  mb-4" />
          <h3 className="text-2xl tracking-tight font-extrabold mb-2 text-[#FFD369]">Upload Your Books</h3>
          <p className="text-white mb-4">List your books on ShelfX for others to rent or buy. Simply upload and start earning!</p>
          <a href="/login-seller"><button className="bg-[#FFD369] text-black py-2 px-4 rounded">Start Selling</button></a>
        </div>
        
        <div className="bg-[#393E46] rounded-lg p-6 shadow-lg w-80 text-left card">
        <a href='/login-Buyer'>
          <img src={Hand} alt="Rent Book" className="w-50 mb-16" />
          <h3 className="text-2xl tracking-tight font-extrabold mb-2 text-[#FFD369]">Rent Books</h3>
          <p className="text-white mb-4">Browse a vast collection of books available for rent. Enjoy reading without the commitment of buying.</p>
          <button className="bg-[#FFD369] text-black py-2 px-4 rounded ">Explore Rentals</button></a>
        </div>
        <div className="bg-[#393E46] rounded-lg p-6 shadow-lg w-80 text-left card">
          <img src={Price} alt="Sell Book" className="w-50 mb-4" />
          <h3 className="text-2xl tracking-tight font-extrabold mb-2 text-[#FFD369]">Sell Your Books</h3>
          <p className="text-white mb-4">Have books you no longer need? Sell them on ShelfX and connect with buyers directly.</p>
          <a href="/login-seller"><button className="bg-[#FFD369] text-black py-2 px-4 rounded">List a Book</button></a>
        </div>
      </div>
    </div>
  );
};

export default Roles;
