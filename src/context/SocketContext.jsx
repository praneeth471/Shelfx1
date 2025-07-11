import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const SOCKET_URL = 'http://localhost:5000';
const API_BASE_URL = 'http://localhost:5000';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isConnected, setIsConnected] = useState(false);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/check-auth`, {
          withCredentials: true
        });
        if (response.data.authenticated) {
          const userType = response.data.userType || 'buyer';
          const user = {
            id: response.data.userId,
            type: userType
          };
          setCurrentUser(user);
          console.log('SocketContext: Current user set:', user);
          
          // Fetch unread counts immediately after user is set
          console.log('SocketContext: Fetching initial unread counts...');
          await fetchUnreadCounts(user);
        }
      } catch (error) {
        console.error('SocketContext: Error getting current user:', error);
      }
    };
    getCurrentUser();
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (!currentUser) return;

    const newSocket = io(SOCKET_URL, {
      query: {
        userId: currentUser.id,
        userType: currentUser.type
      },
      withCredentials: true
    });

    newSocket.on('connect', () => {
      console.log('SocketContext: Socket connected successfully');
      setIsConnected(true);
      // Fetch unread counts again after socket connection
      fetchUnreadCounts(currentUser);
    });

    newSocket.on('disconnect', () => {
      console.log('SocketContext: Socket disconnected');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser]);

  // Fetch unread counts
  const fetchUnreadCounts = async (user = currentUser) => {
    if (!user) {
      console.log('SocketContext: No user available for fetching unread counts');
      return;
    }

    try {
      const endpoint = user.type === 'seller' 
        ? `${API_BASE_URL}/api/chat/unread-counts/seller/${user.id}`
        : `${API_BASE_URL}/api/chat/unread-counts/${user.id}`;
      
      console.log('SocketContext: Fetching unread counts from:', endpoint);
      
      const response = await axios.get(endpoint, {
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      console.log('SocketContext: Raw unread counts API response:', response.data);
      
      if (response.data) {
        // Process the unread counts and ensure bookIds are numbers
        const processedCounts = {};
        Object.entries(response.data).forEach(([bookId, count]) => {
          const numericId = Number(bookId);
          if (!isNaN(numericId)) {
            processedCounts[numericId] = Number(count) || 0;
            console.log(`SocketContext: Processing unread count - Book ID: ${numericId} (${typeof numericId}), Count: ${count}`);
          } else {
            console.warn(`SocketContext: Invalid book ID received: ${bookId}`);
          }
        });
        
        console.log('SocketContext: Setting unread counts to:', processedCounts);
        setUnreadCounts(processedCounts);
        
        // Use useEffect to verify the state update
        return processedCounts;
      } else {
        console.log('SocketContext: No unread counts data received from API');
        setUnreadCounts({});
        return {};
      }
    } catch (error) {
      console.error('SocketContext: Error fetching unread counts:', error);
      if (error.response) {
        console.error('SocketContext: Error response data:', error.response.data);
        console.error('SocketContext: Error response status:', error.response.status);
      }
      setUnreadCounts({});
      return {};
    }
  };

  // Add a new useEffect to monitor unreadCounts changes
  useEffect(() => {
    console.log('SocketContext: Unread counts state updated:', unreadCounts);
  }, [unreadCounts]);

  // Listen for new messages and update unread counts
  useEffect(() => {
    if (!socket || !currentUser) return;

    const handleNewMessage = async (data) => {
      console.log('SocketContext: New message received:', data);
      const newCounts = await fetchUnreadCounts();
      console.log('SocketContext: Updated counts after new message:', newCounts);
    };

    const handleNewNotification = async (data) => {
      console.log('SocketContext: New notification received:', data);
      const newCounts = await fetchUnreadCounts();
      console.log('SocketContext: Updated counts after notification:', newCounts);
    };

    const handleMessagesRead = async (data) => {
      console.log('SocketContext: Messages marked as read:', data);
      const newCounts = await fetchUnreadCounts();
      console.log('SocketContext: Updated counts after messages read:', newCounts);
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('newMessageNotification', handleNewNotification);
    socket.on('messagesRead', handleMessagesRead);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('newMessageNotification', handleNewNotification);
      socket.off('messagesRead', handleMessagesRead);
    };
  }, [socket, currentUser]);

  return (
    <SocketContext.Provider value={{ 
      socket, 
      currentUser, 
      unreadCounts, 
      isConnected,
      fetchUnreadCounts // Export this function to allow manual refresh
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider };