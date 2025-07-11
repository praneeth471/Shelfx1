import db from '../db.config.js';

class Chat {
  static async initializeChat(bookId, sellerId, buyerId) {
    try {
      // First check if chat already exists
      const [existingChat] = await db.query(
        'SELECT * FROM chat_rooms WHERE book_id = ? AND seller_id = ? AND buyer_id = ?',
        [bookId, sellerId, buyerId]
      );

      if (existingChat.length > 0) {
        console.log('Existing chat room found:', existingChat[0]);
        return existingChat[0];
      }

      // If no existing chat, create new one
      const [result] = await db.query(
        'INSERT INTO chat_rooms (book_id, seller_id, buyer_id) VALUES (?, ?, ?)',
        [bookId, sellerId, buyerId]
      );

      return { id: result.insertId, book_id: bookId, seller_id: sellerId, buyer_id: buyerId };
    } catch (error) {
      console.error('Error in initializeChat:', error);
      // If it's a duplicate entry error, try to fetch the existing chat
      if (error.code === 'ER_DUP_ENTRY') {
        const [existingChat] = await db.query(
          'SELECT * FROM chat_rooms WHERE book_id = ? AND seller_id = ? AND buyer_id = ?',
          [bookId, sellerId, buyerId]
        );
        if (existingChat.length > 0) {
          return existingChat[0];
        }
      }
      throw error;
    }
  }

  static async getMessages(chatRoomId) {
    try {
      const [messages] = await db.query(
        `SELECT m.*, 
         CASE 
           WHEN m.sender_id = cr.buyer_id THEN b.username 
           ELSE s.username 
         END as sender_name
         FROM messages m
         JOIN chat_rooms cr ON m.chat_room_id = cr.id
         LEFT JOIN buyers b ON m.sender_id = b.id AND m.sender_id = cr.buyer_id
         LEFT JOIN users s ON m.sender_id = s.id AND m.sender_id = cr.seller_id
         WHERE m.chat_room_id = ? 
         ORDER BY m.created_at ASC`,
        [chatRoomId]
      );
      return messages;
    } catch (error) {
      throw error;
    }
  }

  static async addMessage(chatRoomId, content, senderId) {
    try {
      if (!content || !chatRoomId || !senderId) {
        throw new Error('Missing required message data');
      }

      // Get the chat room to determine if sender is buyer or seller
      const [chatRoom] = await db.query(
        'SELECT * FROM chat_rooms WHERE id = ?',
        [chatRoomId]
      );

      if (!chatRoom.length) {
        throw new Error('Chat room not found');
      }

      // Determine if sender is buyer or seller
      const isBuyer = chatRoom[0].buyer_id === senderId;
      const isSeller = chatRoom[0].seller_id === senderId;

      if (!isBuyer && !isSeller) {
        throw new Error('Sender is not part of this chat room');
      }

      console.log('Adding new message with is_read = 0');
      // Insert new message with explicit is_read = 0
      const [result] = await db.query(
        'INSERT INTO messages (chat_room_id, sender_id, message, is_read) VALUES (?, ?, ?, 0)',
        [chatRoomId, senderId, content]
      );

      // Get the newly created message with sender information
      const [messages] = await db.query(
        `SELECT m.*, 
         CASE 
           WHEN m.sender_id = cr.buyer_id THEN b.username 
           ELSE s.username 
         END as sender_name
         FROM messages m
         JOIN chat_rooms cr ON m.chat_room_id = cr.id
         LEFT JOIN buyers b ON m.sender_id = b.id AND m.sender_id = cr.buyer_id
         LEFT JOIN users s ON m.sender_id = s.id AND m.sender_id = cr.seller_id
         WHERE m.id = ?`,
        [result.insertId]
      );

      console.log('New message added:', messages[0]);
      return messages[0];
    } catch (error) {
      console.error('Error handling message:', error);
      throw error;
    }
  }

  static async markMessagesAsRead(chatRoomId, userId) {
    try {
      console.log(`Marking messages as read in chat ${chatRoomId} for user ${userId}`);
      
      // First verify the chat room exists
      const [chatRoom] = await db.query(
        'SELECT * FROM chat_rooms WHERE id = ?',
        [chatRoomId]
      );

      if (!chatRoom.length) {
        console.error('Chat room not found:', chatRoomId);
        throw new Error('Chat room not found');
      }

      // Update messages to mark them as read
      const [result] = await db.query(
        'UPDATE messages SET is_read = 1 WHERE chat_room_id = ? AND sender_id != ? AND is_read = 0',
        [chatRoomId, userId]
      );

      console.log(`Marked ${result.affectedRows} messages as read`);
      return result.affectedRows;
    } catch (error) {
      console.error('Error in markMessagesAsRead:', error);
      throw error;
    }
  }

  static async getChatsByUserId(userId, userType) {
    try {
      const column = userType === 'seller' ? 'seller_id' : 'buyer_id';
      const [chats] = await db.query(
        `SELECT cr.*, b.bookName, b.price, 
         CASE 
           WHEN ? = 'seller' THEN bu.username 
           ELSE s.username 
         END as other_user_name,
         (SELECT COUNT(*) FROM messages m WHERE m.chat_room_id = cr.id AND m.sender_id != ? AND m.is_read = 0) as unread_count
         FROM chat_rooms cr
         JOIN books b ON cr.book_id = b.id
         JOIN buyers bu ON cr.buyer_id = bu.id
         JOIN users s ON cr.seller_id = s.id
         WHERE cr.${column} = ?`,
        [userType, userId, userId]
      );
      return chats;
    } catch (error) {
      throw error;
    }
  }

  static async getActiveChatsForSeller(sellerId) {
    try {
      // First verify the seller exists in users table
      const [seller] = await db.query('SELECT id FROM users WHERE id = ?', [sellerId]);
      if (!seller.length) {
        throw new Error('Seller not found');
      }

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
      
      return chats;
    } catch (error) {
      console.error('Error in getActiveChatsForSeller:', error);
      throw error;
    }
  }

  static async getUnreadCounts(userId, userType) {
    try {
      console.log(`Getting unread counts for ${userType} ${userId}`);
      
      // Verify user exists
      const table = userType === 'seller' ? 'users' : 'buyers';
      const [user] = await db.query(`SELECT id FROM ${table} WHERE id = ?`, [userId]);
      if (!user.length) {
        console.log(`${userType} not found:`, userId);
        throw new Error(`${userType} not found`);
      }

      // Get unread message counts for each chat room
      const [results] = await db.query(
        `SELECT cr.book_id, COUNT(m.id) as unread_count
         FROM chat_rooms cr
         JOIN messages m ON cr.id = m.chat_room_id
         WHERE cr.${userType === 'seller' ? 'seller_id' : 'buyer_id'} = ? 
         AND m.sender_id != ? 
         AND m.is_read = 0
         GROUP BY cr.book_id`,
        [userId, userId]
      );

      console.log('Raw unread counts results:', results);

      // Convert results to object with book_id as key
      const unreadCounts = results.reduce((acc, { book_id, unread_count }) => {
        acc[book_id] = unread_count;
        return acc;
      }, {});

      console.log('Processed unread counts:', unreadCounts);
      return unreadCounts;
    } catch (error) {
      console.error('Error getting unread counts:', error);
      throw error;
    }
  }
}

export default Chat; 