'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuthState, login, logout } from '../lib/authService';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  loginWithGoogle: () => Promise<void>
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loginSource, setLoginSource] = useState<string | null>(null); // New state for login source

  // useEffect(() => {
  //   console.log("Checking auth status...");
  //   checkAuthStatus();
  //   console.log("isAuthenticated:", isAuthenticated);
  // }, []);

  // Store tokens passed from URL query parameters
  const storeTokensFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');

    // if (accessToken && refreshToken) {
    //   localStorage.setItem('accessToken', accessToken);
    //   localStorage.setItem('refreshToken', refreshToken);
    //   return true;
    // }

    if (accessToken && refreshToken) {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          setIsAuthenticated(true);
          setUser(user); // Ideally, set the user data from tokens
          
          // Clean the URL after processing
          urlParams.delete('accessToken');
          urlParams.delete('refreshToken');
          urlParams.delete('loginSource');
          window.history.replaceState({}, document.title, window.location.pathname);
          return true;
    }

    return false;
  };

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
          setUser(result.user);

          if (result.loginSource) {
            setLoginSource(result.loginSource);
          }
        } else {
          await logoutUser();
        }
      } catch (error) {
        console.error("Error checking tokens:", error);
        await logoutUser();
      }
    } else {
      console.log("No tokens found.");
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (!storeTokensFromURL()) {
        await checkAuthStatus();
      }
    };
    initializeAuth();
  }, []);




  // useEffect(() => {
  //   console.log('Current user state in AuthProvider:', user);
  // }, [user]);
  
  // const checkAuthStatus = async () => {
  //   const accessToken = localStorage.getItem('accessToken');
  //   const refreshToken = localStorage.getItem('refreshToken');

  //   if (accessToken && refreshToken) {
  //     try {
  //       const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/check-tokens`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ accessToken, refreshToken }),
  //       });

  //       if (response.ok) {
  //         const result = await response.json();
  //         localStorage.setItem('accessToken', result.accessToken);
  //         localStorage.setItem('refreshToken', result.refreshToken);
  //         setIsAuthenticated(true);
  //         setUser(result.user); // Assuming you return user info from this endpoint
  //       } else {
  //         await logoutUser();
  //       }
  //     } catch (error) {
  //       console.error("Error checking tokens:", error);
  //       await logoutUser();
  //     }
  //   } else {
  //     setIsAuthenticated(false);
  //   }
  // };

  // useEffect(() => {
  //   checkAuthStatus();
  // }, []);

  const loginUser = async (email: string, password: string) => {
    try {
      const { user, accessToken, refreshToken } = await login(email, password);
      setIsAuthenticated(true);
      setUser(user);
      console.log(user);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logoutUser = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  const loginWithGoogle = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/google`;
  }


  // After Google login callback
  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const accessToken = urlParams.get('accessToken');
  //   const refreshToken = urlParams.get('refreshToken');
  //   const loginSource = urlParams.get('loginSource');
  
  //   if (accessToken && refreshToken) {
  //     localStorage.setItem('accessToken', accessToken);
  //     localStorage.setItem('refreshToken', refreshToken);
  //     setIsAuthenticated(true);
  //     setUser(user); // Ideally, set the user data from tokens
  //     setLoginSource(loginSource);
  
  //     // Clean the URL after processing
  //     urlParams.delete('accessToken');
  //     urlParams.delete('refreshToken');
  //     urlParams.delete('loginSource');
  //     window.history.replaceState({}, document.title, window.location.pathname);
  //   }
  // }, []);



  // After Google login callback
  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const accessToken = urlParams.get('accessToken');
  //   const refreshToken = urlParams.get('refreshToken');
  //   const loginSource = urlParams.get('loginSource');
  //   const userId = urlParams.get('userId');
  //   const email = urlParams.get('email');
  //   const username = urlParams.get('username');
  
  //   if (accessToken && refreshToken) {
  //     localStorage.setItem('accessToken', accessToken);
  //     localStorage.setItem('refreshToken', refreshToken);
  //     setIsAuthenticated(true);
  
  //     // Set the user data directly from URL parameters
  //     const userData = { _id: userId!, email: email!, username: username! };
  //     setUser(userData);
  //     console.log('User set in AuthProvider:', userData);
  //     localStorage.setItem('user', JSON.stringify(userData));
  
  //     setLoginSource(loginSource);
  
  //     // Clean the URL after processing
  //     urlParams.delete('accessToken');
  //     urlParams.delete('refreshToken');
  //     urlParams.delete('loginSource');
  //     urlParams.delete('userId');
  //     urlParams.delete('email');
  //     urlParams.delete('username');
  //     window.history.replaceState({}, document.title, window.location.pathname);
  //   }
  // }, []);
  
  

  useEffect(() => {
    const initializeAuth = () => {
      const savedUser = localStorage.getItem('user');
      const savedAccessToken = localStorage.getItem('accessToken');
      const savedRefreshToken = localStorage.getItem('refreshToken');
      
  
      if (savedUser && savedAccessToken && savedRefreshToken) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
  
    initializeAuth();
  }, []);
  

  







    // try {
    //   // Здесь должна быть логика для входа через Google
    //   // После успешного входа обновляем состояние
    //   window.location.href = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/google`;
    //   setUser(googleUser);
    //   setIsAuthenticated(true);
    //   // Сохраняем данные пользователя и токен в localStorage
    //   localStorage.setItem('accessToken', 'google-access-token');
    //   localStorage.setItem('user', JSON.stringify(googleUser));
    // } catch (error) {
    //   console.error('Google login failed', error);
    // }
  //};


  // useEffect(() => {
  //   const checkAuthStatus = async () => {
  //     const accessToken = localStorage.getItem('accessToken');
  //     const refreshToken = localStorage.getItem('refreshToken');
  
  //     if (accessToken && refreshToken) {
  //       try {
  //         const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/check-tokens`, {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({ accessToken, refreshToken }),
  //         });
  
  //         if (response.ok) {
  //           const result = await response.json();
  //           localStorage.setItem('accessToken', result.accessToken);
  //           localStorage.setItem('refreshToken', result.refreshToken);
  //           setIsAuthenticated(true);
  //         } else {
  //           await logoutUser();
  //         }
  //       } catch (error) {
  //         console.error("Error checking tokens:", error);
  //         await logoutUser();
  //       }
  //     } else {
  //       setIsAuthenticated(false);
  //     }
  //   };
  
  //   checkAuthStatus();
  // }, []);
  

  

  // const loginUser = async (email: string, password: string) => {
  //   try {
  //     const { user } = await login(email, password);
  //     setIsAuthenticated(true);
  //     setUser(user);
  //   } catch (error) {
  //     console.error('Login failed', error);
  //   }
  // };

  // const logoutUser = async () => {
  //   localStorage.removeItem('accessToken');
  //   localStorage.removeItem('refreshToken');
  //   setIsAuthenticated(false);
  // };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loginUser, logoutUser, loginWithGoogle }}>
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
