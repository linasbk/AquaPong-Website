"use client";

import { useEffect, useState, useRef, useCallback } from 'react';

export function useWebSocket(url, onMessage){
  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect
    socket.current = new WebSocket(url);
    socket.current.onopen = () => {
      setIsConnected(true);
    };

    socket.current.onclose = () => {
      setIsConnected(false);
    };

    socket.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    // Cleanup on component unmount
    return () => {
      socket.current.close();
    };
  }, [url]);

  // Sending messages
  const sendMessage = useCallback((message) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(message));
    }
  }, []);

  // Handling incoming messages
  useEffect(() => {
    if (!socket.current) return;
    
    socket.current.onmessage = (event) => {
      if (onMessage) {
        onMessage(JSON.parse(event.data));
      }
    };
  }, [onMessage]);

  return { sendMessage, isConnected };
};

