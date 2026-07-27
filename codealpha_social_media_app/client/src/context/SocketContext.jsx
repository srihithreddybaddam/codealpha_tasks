import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import useAuth from '../hooks/useAuth';
import { getToken } from '../utils/storage';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsersMap, setOnlineUsersMap] = useState({});
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(2);

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = getToken();
      const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/';

      const newSocket = io(socketUrl, {
        auth: { token },
        query: { userId: user._id }
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('[Vibely Socket] Connected:', newSocket.id);
      });

      newSocket.on('online_status_update', (data) => {
        setOnlineUsersMap((prev) => ({
          ...prev,
          [data.userId]: data.isOnline
        }));
      });

      newSocket.on('receive_notification', () => {
        setUnreadNotificationsCount((prev) => prev + 1);
      });

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsersMap,
        unreadNotificationsCount,
        setUnreadNotificationsCount
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
