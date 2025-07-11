import Chat from '../models/chat.model.js';
import db from '../db.config.js';
import { redis } from '../config/redis.js';

export const initializeChat = async (req, res) => {
  try {
    const { bookId, sellerId, buyerId } = req.body;

    if (!bookId || !sellerId || !buyerId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const chat = await Chat.initializeChat(bookId, sellerId, buyerId);
    const messages = await Chat.getMessages(chat.id);

    res.status(200).json({
      chatId: chat.id,
      messages
    });
  } catch (error) {
    console.error('Error initializing chat:', error);
    res.status(500).json({ message: 'Error initializing chat' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Chat.getMessages(chatId);
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, senderType } = req.body;

    if (!content || !senderType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const message = await Chat.addMessage(chatId, content, senderType);
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const { userId, userType } = req.params;
    const chats = await Chat.getChatsByUserId(userId, userType);
    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching user chats:', error);
    res.status(500).json({ message: 'Error fetching user chats' });
  }
};

export const getUnreadCounts = async (req, res) => {
  try {
    const { buyerId } = req.params;
    console.log('Getting unread counts for buyer:', buyerId);

    const unreadCounts = await Chat.getUnreadCounts(buyerId, 'buyer');
    console.log('Sending unread counts response:', unreadCounts);
    res.json(unreadCounts);
  } catch (error) {
    console.error('Error getting unread counts:', error);
    res.status(500).json({ message: 'Error getting unread counts' });
  }
};

export const getActiveChatsForSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    console.log('Getting active chats for seller:', sellerId);

    // Verify seller exists
    const [seller] = await db.query('SELECT id FROM users WHERE id = ?', [sellerId]);
    if (!seller.length) {
      console.log('Seller not found:', sellerId);
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Get active chats for seller
    const [chats] = await db.query(
      `SELECT 
        cr.id,
        cr.book_id,
        cr.buyer_id,
        b.username as buyer_name,
        bk.bookName,
        bk.imageData as bookImage,
        bk.price,
        bk.listingType,
        (
          SELECT message 
          FROM messages 
          WHERE chat_room_id = cr.id 
          ORDER BY created_at DESC 
          LIMIT 1
        ) as last_message,
        (
          SELECT created_at 
          FROM messages 
          WHERE chat_room_id = cr.id 
          ORDER BY created_at DESC 
          LIMIT 1
        ) as last_message_time,
        (
          SELECT COUNT(*) 
          FROM messages 
          WHERE chat_room_id = cr.id 
          AND sender_id != ? 
          AND is_read = 0
        ) as unread_count
      FROM chat_rooms cr
      JOIN buyers b ON cr.buyer_id = b.id
      JOIN books bk ON cr.book_id = bk.id
      WHERE cr.seller_id = ?
      AND EXISTS (
        SELECT 1 
        FROM messages m 
        WHERE m.chat_room_id = cr.id
      )
      ORDER BY last_message_time DESC`,
      [sellerId, sellerId]
    );

    console.log('Active chats found:', chats.length);
    res.json(chats);
  } catch (error) {
    console.error('Error getting active chats:', error);
    res.status(500).json({ message: 'Error getting active chats' });
  }
};

export const clearRedisCache = async (req, res) => {
  try {
    console.log('Clearing Redis cache...');
    await redis.flushall();
    console.log('Redis cache cleared successfully');
    res.status(200).json({ message: 'Redis cache cleared successfully' });
  } catch (error) {
    console.error('Error clearing Redis cache:', error);
    res.status(500).json({ message: 'Error clearing Redis cache' });
  }
}; 