import { Server } from 'socket.io';
import Chat from './models/chat.model.js';

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Store active users and their socket IDs
  const activeUsers = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    console.log('Connection query:', socket.handshake.query);

    // Store user information when they connect
    const { userId, userType } = socket.handshake.query;
    if (userId) {
      activeUsers.set(userId, socket.id);
      console.log('Active users:', Object.fromEntries(activeUsers));
    }

    // Handle joining a chat room
    socket.on('joinChat', async (chatRoomId) => {
      try {
        console.log(`User ${userId} joining chat ${chatRoomId}`);
        socket.join(chatRoomId);
        
        // Mark messages as read when user joins the chat
        if (userId) {
          console.log(`Marking messages as read for user ${userId} in chat ${chatRoomId}`);
          await Chat.markMessagesAsRead(chatRoomId, userId);
          // Notify other users that messages have been read
          socket.to(chatRoomId).emit('messagesRead', { chatRoomId, userId });
        }
      } catch (error) {
        console.error('Error in joinChat:', error);
      }
    });

    // Handle sending messages
    socket.on('sendMessage', async (messageData) => {
      try {
        console.log('Received message data:', messageData);
        
        if (!messageData.content || !messageData.chatRoomId || !messageData.senderId) {
          throw new Error('Missing required message data');
        }

        // Save message to database
        const message = await Chat.addMessage(
          messageData.chatRoomId,
          messageData.content,
          messageData.senderId
        );

        console.log('Message saved to database:', message);

        // Broadcast message to all users in the chat room
        io.to(messageData.chatRoomId).emit('newMessage', {
          ...message,
          created_at: messageData.timestamp
        });

        // Notify other user about new message if they're not in the chat
        const otherUserId = messageData.senderId === messageData.buyerId 
          ? messageData.sellerId 
          : messageData.buyerId;
        
        console.log('Looking for other user socket:', otherUserId);
        const otherUserSocketId = activeUsers.get(otherUserId);
        console.log('Other user socket ID:', otherUserSocketId);

        if (otherUserSocketId) {
          console.log('Sending notification to user:', otherUserId);
          io.to(otherUserSocketId).emit('newMessageNotification', {
            chatRoomId: messageData.chatRoomId,
            message: message
          });
        } else {
          console.log('Other user not found in active users');
        }
      } catch (error) {
        console.error('Error handling message:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    // Handle marking messages as read
    socket.on('markAsRead', async ({ chatRoomId }) => {
      try {
        if (!userId) {
          console.error('No user ID available for markAsRead');
          return;
        }
        console.log(`Marking messages as read for user ${userId} in chat ${chatRoomId}`);
        await Chat.markMessagesAsRead(chatRoomId, userId);
        socket.to(chatRoomId).emit('messagesRead', { chatRoomId, userId });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Remove user from active users
      for (const [userId, socketId] of activeUsers.entries()) {
        if (socketId === socket.id) {
          activeUsers.delete(userId);
          console.log('Removed user from active users:', userId);
          break;
        }
      }
      console.log('Remaining active users:', Object.fromEntries(activeUsers));
    });
  });

  return io;
}; 