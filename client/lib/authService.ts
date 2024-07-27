
export const getAuthState = async () => {
    const token = localStorage.getItem('authToken');
    const user = token ? JSON.parse(atob(token.split('.')[1])) : null; // Assuming the token contains user info in its payload
    return { isAuthenticated: Boolean(token), user };
  };
  
  export const login = async (email: string, password: string) => {
    // Make an API call to login
    const response = await fetch('/api/v5/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  
    if (response.ok) {
      const { accessToken, refreshToken, user } = await response.json();
      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      return { user };
    }
  
    throw new Error('Login failed');
  };
  
  export const logout = async () => {
    // Perform any necessary cleanup, such as invalidating tokens
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  };
  