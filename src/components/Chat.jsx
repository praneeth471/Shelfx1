import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const API_BASE_URL = 'http://localhost:5000';
const SOCKET_URL = 'http://localhost:5000';

const Chat = ({ bookId, sellerId, buyerId, userType }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherUserName, setOtherUserName] = useState('');
  const messagesEndRef = useRef(null);
  const [chatRoomId, setChatRoomId] = useState(null);
  const socketRef = useRef(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/check-auth`, {
          withCredentials: true
        });
        console.log('Auth response:', response.data);
        if (response.data.authenticated) {
          setCurrentUserId(response.data.userId);
          console.log('Current user ID set to:', response.data.userId);
        } else {
          setError('Please log in to use chat');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting current user:', error);
        setError('Authentication failed. Please try again.');
        setLoading(false);
      }
    };
    getCurrentUser();
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (!currentUserId) return;

    console.log('Initializing socket connection with:', {
      userId: currentUserId,
      userType,
      bookId,
      sellerId,
      buyerId
    });

    socketRef.current = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      query: {
        userId: currentUserId,
        userType: userType
      }
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected successfully');
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setError('Failed to connect to chat server. Please try again.');
      setLoading(false);
    });

    socketRef.current.on('newMessage', (message) => {
      console.log('New message received:', message);
      // Ensure the message has the correct structure
      const formattedMessage = {
        ...message,
        sender_id: message.senderId || message.sender_id,
        content: message.content || message.message,
        created_at: message.created_at || message.timestamp,
        is_read: message.is_read || false
      };
      setMessages(prevMessages => [...prevMessages, formattedMessage]);
      scrollToBottom();
      
      // If message is from other user, mark as read
      if (formattedMessage.sender_id !== currentUserId) {
        socketRef.current.emit('markAsRead', { chatRoomId });
      }
    });

    socketRef.current.on('messagesRead', ({ chatRoomId: readChatRoomId, userId }) => {
      if (readChatRoomId === chatRoomId && userId !== currentUserId) {
        setMessages(prev => prev.map(msg => ({
          ...msg,
          is_read: true
        })));
      }
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
      setError('Connection error. Please refresh the page.');
      setLoading(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [currentUserId, userType, chatRoomId]);

  // Initialize chat and fetch messages
  useEffect(() => {
    const initializeChat = async () => {
      if (!currentUserId || !bookId || !sellerId || !buyerId) {
        console.log('Missing required data for chat initialization:', {
          currentUserId,
          bookId,
          sellerId,
          buyerId
        });
        return;
      }

      try {
        setLoading(true);
        console.log('Initializing chat with:', {
          bookId,
          sellerId,
          buyerId,
          userType
        });

        // Get user details based on userType
        // If current user is seller, we need buyer details and vice versa
        const userIdToFetch = userType === 'seller' ? buyerId : sellerId;
        const userTypeToFetch = userType === 'seller' ? 'buyer' : 'seller';
        
        console.log('Fetching user details:', {
          userIdToFetch,
          userTypeToFetch
        });

        const userResponse = await axios.get(
          `${API_BASE_URL}/api/chat/user-details/${userIdToFetch}/${userTypeToFetch}`,
          {
            withCredentials: true
          }
        );
        console.log('User details response:', userResponse.data);
        
        const userData = userResponse.data.user;
        setOtherUserName(userData.username);

        // Then initialize the chat
        const response = await axios.post(
          `${API_BASE_URL}/api/chat/initialize`,
          {
            bookId,
            sellerId,
            buyerId
          },
          {
            withCredentials: true
          }
        );
        console.log('Chat initialization response:', response.data);
        
        setChatRoomId(response.data.chatId);
        setMessages(response.data.messages || []);
        
        // Join the chat room
        if (socketRef.current) {
          socketRef.current.emit('joinChat', response.data.chatId);
        }

        setError(null);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setError('Failed to initialize chat. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [bookId, sellerId, buyerId, userType, currentUserId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatRoomId || !currentUserId) return;

    try {
      const messageData = {
        chatRoomId,
        content: newMessage.trim(),
        senderId: currentUserId,
        buyerId,
        sellerId,
        timestamp: new Date().toISOString()
      };

      console.log('Sending message:', messageData);

      // Send message through socket
      socketRef.current.emit('sendMessage', messageData);

      // Optimistically add message to UI
      setMessages(prevMessages => [...prevMessages, {
        ...messageData,
        sender_id: currentUserId,
        message: newMessage.trim(),
        created_at: messageData.timestamp,
        is_read: false
      }]);
      
      setNewMessage('');
      setError(null);
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[400px] bg-[#222831] rounded-lg shadow-lg items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD369]"></div>
        <p className="text-[#FFD369] mt-4">Loading chat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-[400px] bg-[#222831] rounded-lg shadow-lg p-4 items-center justify-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#FFD369] text-[#222831] rounded-lg hover:bg-[#e6bd5f] focus:outline-none focus:ring-2 focus:ring-[#FFD369] font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[400px] bg-[#222831] rounded-lg shadow-lg">
      <div className="p-4 border-b border-[#393E46]">
        <h3 className="text-lg font-semibold text-[#FFD369]">
          Chat with {otherUserName}
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender_id === currentUserId
                    ? 'bg-[#FFD369] text-[#222831]'
                    : 'bg-[#393E46] text-white'
                }`}
              >
                <div className="text-sm mb-1 opacity-75">
                  {message.sender_id === currentUserId ? 'You' : otherUserName}
                </div>
                <div className="whitespace-pre-wrap break-words">
                  {message.message}
                </div>
                <div className="text-xs mt-1 opacity-75 flex items-center gap-1">
                  {new Date(message.created_at).toLocaleTimeString()}
                  {message.sender_id === currentUserId && (
                    <span className="ml-1">
                      {message.is_read ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-[#393E46]">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 bg-[#393E46] text-white border border-[#4a4f57] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD369] placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              newMessage.trim()
                ? 'bg-[#FFD369] text-[#222831] hover:bg-[#e6bd5f]'
                : 'bg-[#4a4f57] text-gray-400 cursor-not-allowed'
            }`}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat; 