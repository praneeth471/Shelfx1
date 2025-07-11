import React, { useEffect, useState } from "react";

// Card Component for displaying request details
const Card = ({ name, time, amount, date, status }) => {
  let statusColor;
  switch (status) {
    case "DECLINED":
      statusColor = "bg-red-100 text-red-700";
      break;
    case "APPROVED":
      statusColor = "bg-green-100 text-green-700";
      break;
    default:
      statusColor = "bg-yellow-100 text-yellow-700";
  }

  return (
    <div className="p-5 bg-black ">
      <h3 >{name}</h3>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <span className="material-icons text-gray-400">schedule</span>
          <span>{time}</span>
        </div>
        <span className="font-medium text-gray-700">{amount}</span>
      </div>

      <p className="text-sm text-gray-500">{date}</p>

      <div
        className={`inline-block px-4 py-2 rounded-full text-xs font-semibold ${statusColor}`}
      >
        {status}
      </div>
    </div>
  );
};

export default Card;


// const HistoryDashboard = () => {
//   const [req, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`http://localhost:5000/requests/status`, {
//           withCredentials: true,
//         });
//         setRequests(response.data.requests);
//       } catch (err) {
//         setError(err.response?.data?.message || err.message); // More detailed error handling
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequests();
//   }, []);

//   if (loading) {
//     return <div className="text-center">Loading...</div>; // Consider using a spinner here
//   }

//   if (error) {
//     return <div className="text-center text-red-500">{error}</div>;
//   }

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-6">History</h1>
//       <div className="gap-6 bg-white">
//         {req.length > 0 ? (
//           req.map((request) => (
//             <Card
//               key={request.bookId} 
//               name={request.bookName}
//               amount={request.bookPrice}
//               date={new Date(request.date).toLocaleDateString()} // Format the date
//               status={request.status}
//             />
//           ))
//         ) : (
//           <p className="text-center text-gray-500">No requests found</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HistoryDashboard;
