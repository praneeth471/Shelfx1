import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { FaBook, FaUser, FaCalendarAlt, FaRupeeSign } from 'react-icons/fa';

const RequestHistory = ({ sellerId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/history/seller/${sellerId}`, {
          withCredentials: true
        });
        setHistory(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch history');
        setLoading(false);
        console.error('Error fetching history:', err);
      }
    };

    if (sellerId) {
      fetchHistory();
    }
  }, [sellerId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-6 px-4">
      <h3 className="text-2xl font-bold mb-6 text-[#222831] border-b pb-3">Sales History</h3>
      {history.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No sales history found.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {history.map((request) => (
            <div key={request.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <FaBook className="text-[#00ADB5] text-xl" />
                      <h4 className="font-semibold text-xl text-[#393E46]">{request.bookName}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <FaRupeeSign className="text-[#00ADB5]" />
                          <span className="text-gray-700 font-medium">Price:</span>
                          <span className="text-[#393E46]">₹{request.price}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <FaUser className="text-[#00ADB5]" />
                          <span className="text-gray-700 font-medium">Buyer:</span>
                          <span className="text-[#393E46]">{request.buyerName}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {request.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-[#00ADB5]" />
                          <span className="text-gray-700 font-medium">Sold on:</span>
                          <span className="text-[#393E46]">
                            {new Date(request.requestDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestHistory; 