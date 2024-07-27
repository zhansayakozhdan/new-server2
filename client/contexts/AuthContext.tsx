'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuthState, login, logout } from '../lib/authService';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
  
      if (accessToken && refreshToken) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/check-tokens`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessToken, refreshToken }),
          });
  
          if (response.ok) {
            const result = await response.json();
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            setIsAuthenticated(true);
          } else {
            await logoutUser();
          }
        } catch (error) {
          console.error("Error checking tokens:", error);
          await logoutUser();
        }
      } else {
        setIsAuthenticated(false);
      }
    };
  
    checkAuthStatus();
  }, []);
  

  

  const loginUser = async (email: string, password: string) => {
    try {
      const { user } = await login(email, password);
      setIsAuthenticated(true);
      setUser(user);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logoutUser = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };
