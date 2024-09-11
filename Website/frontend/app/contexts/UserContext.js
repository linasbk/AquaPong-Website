"use client";
import React, { useCallback, createContext, useContext, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
export const UserContext = createContext();

export function Context({ children }) {
  const queryClient = new QueryClient();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [current_user, set_current_user] = useState({
    id: 0,
    user: {
      image: 'lol',
      username: "lol",
    },
    friends: null,
    typing: false,
    interaction_time: new Date().toISOString(),
  });

  const refreshAccessToken = useCallback(async () => {
    const response = await fetch(`${API_ADDRESS}/Sign_up/token/refresh`
    
    , {
      method: 'POST',
      credentials: 'include',
    });
    return response.ok;
  }, []);

  const authenticatedFetch = useCallback(async (url, options) => {
    let response = await fetch(url, {
      ...options,
      credentials: 'include',
    });
    if (response.status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        response = await fetch(url, {
          ...options,
          credentials: 'include'
        });
      }
    }
    return response;
  }, [refreshAccessToken]);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await authenticatedFetch(`${API_ADDRESS}/Sign_up/check-auth`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.user);
        setCurrentUser(data.user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUserInfo(null);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUserInfo(null);
      setCurrentUser(null);
      setIsLoading(false);
    }
    setIsLoading(false);
  }, [authenticatedFetch]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = async () => {
    try {
      await fetch(`${API_ADDRESS}/Sign_up/signout`, {
        method: 'POST',
        credentials: 'include',
      });
      setIsAuthenticated(false);
      setUserInfo(null);
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const authValues = {
    isAuthenticated,
    setIsAuthenticated,
    currentUser,
    setCurrentUser,
    userInfo,
    setUserInfo,
    current_user,
    set_current_user,
    isLoading,
    setIsLoading,
    checkAuth,
    logout,
};


  return (
    <UserContext.Provider value={authValues}>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    </UserContext.Provider>
  );
}

export function useAuth() {
  return useContext(UserContext);
}