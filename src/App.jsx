import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SellerAuth from './pages/SellerAuth';
import BuyerAuth from './pages/BuyerAuth';
import BookGrid from './pages/BookGrid';
import SellerProfile from './pages/SellerDashBoard';
import Subscription from './pages/Subscription';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login-seller" element={<SellerAuth />} />
          <Route path="/login-Buyer" element={<BuyerAuth />} />
          <Route path="/seller-xyz" element={<SellerProfile />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/BookGrid" element={<BookGrid />} />
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
}

function NotFound() {
  return (
    <div className="not-found-container text-white text-center mt-5">
      <h1>404 - Route Not Found!</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}

export default App;
