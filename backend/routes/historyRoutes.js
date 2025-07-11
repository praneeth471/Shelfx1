import express from 'express';
import { getSellerHistory, getBuyerHistory, addToHistory } from '../controllers/historyController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Get seller's history
router.get('/seller/:sellerId', authenticateUser, getSellerHistory);

// Get buyer history
router.get('/buyer/:buyerId', authenticateUser, getBuyerHistory);

// Add to history
router.post('/', authenticateUser, addToHistory);

export default router; 