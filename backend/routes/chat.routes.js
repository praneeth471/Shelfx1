import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import * as chatController from '../controllers/chat.controller.js';
import db from '../db.config.js';

const router = express.Router();

// Get active chats for a seller
router.get('/seller/:sellerId/active', verifyToken, chatController.getActiveChatsForSeller);

// Get user details for chat
router.get('/user-details/:userId/:userType', verifyToken, async (req, res) => {
  try {
    const { userId, userType } = req.params;
    console.log('Fetching user details for:', { userId, userType });

    let user;
    let query;
    let tableName;

    if (userType === 'buyer') {
      console.log('Querying buyers table for ID:', userId);
      query = 'SELECT id, username FROM buyers WHERE id = ?';
      tableName = 'buyers';
    } else if (userType === 'seller') {
      console.log('Querying users table for ID:', userId);
      query = 'SELECT id, username FROM users WHERE id = ?';
      tableName = 'users';
    } else {
      console.log('Invalid user type:', userType);
      return res.status(400).json({ 
        message: 'Invalid user type',
        details: 'userType must be either "buyer" or "seller"'
      });
    }

    // First check if the table exists
    const [tables] = await db.query('SHOW TABLES LIKE ?', [tableName]);
    if (tables.length === 0) {
      console.error(`Table ${tableName} does not exist`);
      return res.status(500).json({ 
        message: 'Database configuration error',
        details: `Table ${tableName} not found`
      });
    }

    const [rows] = await db.query(query, [userId]);
    console.log('Query result:', rows);

    if (rows.length === 0) {
      console.log(`No user found in ${tableName} table with ID:`, userId);
      return res.status(404).json({ 
        message: 'User not found',
        details: `No user found in ${tableName} table with ID ${userId}`
      });
    }

    user = rows[0];
    console.log('Found user:', user);

    res.json({ user });
  } catch (error) {
    console.error('Error in user-details endpoint:', error);
    res.status(500).json({ 
      message: 'Error fetching user details',
      error: error.message,
      stack: error.stack
    });
  }
});

// Get all chats for a user (seller or buyer)
router.get('/user-chats/:userId/:userType', verifyToken, chatController.getUserChats);

// Initialize a new chat or get existing chat
router.post('/initialize', verifyToken, chatController.initializeChat);

// Get messages for a specific chat
router.get('/:chatId/messages', verifyToken, chatController.getMessages);

// Send a new message
router.post('/:chatId/messages', verifyToken, chatController.sendMessage);

// Get unread message counts for a buyer
router.get('/unread-counts/:buyerId', verifyToken, chatController.getUnreadCounts);

// Clear Redis cache
router.post('/clear-cache', verifyToken, chatController.clearRedisCache);

export default router; 