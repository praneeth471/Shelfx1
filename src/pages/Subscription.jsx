import React, { useState } from 'react';
import axios from 'axios';

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePlanSelection = async (plan) => {
    setSelectedPlan(plan);
    console.log('Selected plan:', selectedPlan); 
    if (!selectedPlan) {
      alert('Please select a plan before subscribing.');
      return;
    }
    try {
      await axios.post(`http://localhost:5000/subscribe/${selectedPlan}`,{},{withCredentials: true});
      alert('Subscription successful!');
    } catch (error) {
      console.error("Error subscribing:", error);
      alert('Failed to subscribe. Please try again.');
    }
  };

  return (
    <section className="bg-[#222831]">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-[#EEEEEE]">Flexible Plans for Book Lovers</h2>
          <p className="mb-5 font-light text-[#EEEEEE] sm:text-xl">
            Start with 5 free book uploads, and grow your library with our affordable subscription plans.
          </p>
        </div>
        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">

          {/* Free Plan */}
          <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-[#EEEEEE] bg-[#393E46] rounded-lg border border-[#393E46] shadow xl:p-8">
            <h3 className="mb-4 text-2xl font-semibold">Free Tier</h3>
            <p className="font-light sm:text-lg text-[#EEEEEE]">Perfect for new users to upload up to 5 books for free.</p>
            <div className="flex justify-center items-baseline my-8">
              <span className="mr-2 text-5xl font-extrabold">Free</span>
            </div>
            <ul role="list" className="mb-8 space-y-4 text-left">
              {/* List items */}
              <li>Upload up to 5 books</li>
              <li>No setup or hidden fees</li>
              <li>Basic support</li>
            </ul>
            <button
              onClick={() => handlePlanSelection('free')}
              className="text-[#222831] bg-[#FFD369] hover:bg-yellow-400 focus:ring-4 focus:ring-[#FFD369] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Get started
            </button>
          </div>

          {/* Starter Plan */}
          <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-[#EEEEEE] bg-[#393E46] rounded-lg border border-[#393E46] shadow xl:p-8">
            <h3 className="mb-4 text-2xl font-semibold">Starter</h3>
            <p className="font-light sm:text-lg text-[#EEEEEE]">For users who need to upload more than 5 books.</p>
            <div className="flex justify-center items-baseline my-8">
              <span className="mr-2 text-5xl font-extrabold">₹2,400</span>
              <span className="text-[#EEEEEE]">/month</span>
            </div>
            <ul role="list" className="mb-8 space-y-4 text-left">
              {/* List items */}
              <li>Upload up to 50 books</li>
              <li>No setup or hidden fees</li>
              <li>Basic support</li>
            </ul>
            <button
              onClick={() => handlePlanSelection('starter')}
              className="text-[#222831] bg-[#FFD369] hover:bg-yellow-400 focus:ring-4 focus:ring-[#FFD369] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Get started
            </button>
          </div>

          {/* Premium Plan */}
          <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-[#EEEEEE] bg-[#393E46] rounded-lg border border-[#393E46] shadow xl:p-8">
            <h3 className="mb-4 text-2xl font-semibold">Premium</h3>
            <p className="font-light sm:text-lg text-[#EEEEEE]">For organizations or individuals with large book collections.</p>
            <div className="flex justify-center items-baseline my-8">
              <span className="mr-2 text-5xl font-extrabold">₹8,200</span>
              <span className="text-[#EEEEEE]">/month</span>
            </div>
            <ul role="list" className="mb-8 space-y-4 text-left">
              {/* List items */}
              <li>Unlimited book uploads</li>
              <li>Priority support</li>
              <li>Access to premium features</li>
            </ul>
            <button
              onClick={() => handlePlanSelection('premium')}
              className="text-[#222831] bg-[#FFD369] hover:bg-yellow-400 focus:ring-4 focus:ring-[#FFD369] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Get started
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Subscription;
