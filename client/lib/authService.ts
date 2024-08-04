
export const getAuthState = async () => {
    const token = localStorage.getItem('authToken');
    const user = token ? JSON.parse(atob(token.split('.')[1])) : null; // Assuming the token contains user info in its payload
    return { isAuthenticated: Boolean(token), user };
  };
  
  export const login = async (email: string, password: string) => {

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include' // Ensure cookies are included in the request
  });
  if (response.ok) {
      // Handle successful login
      console.log('User logged in successfully!');
      const { accessToken, refreshToken, user } = await response.json();
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      return { user, accessToken, refreshToken };
  } else {
      console.error('Login failed:', await response.text());
  }

  throw new Error('Login failed');
  };
  
  export const logout = async () => {
    // Perform any necessary cleanup, such as invalidating tokens
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  };

  // export const loginWithGoogle = async () => {

  //   const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/google`, {
  //     method: 'GET',
  //     headers: {
  //         'Content-Type': 'application/json',
  //     },
  //     credentials: 'include' // Ensure cookies are included in the request
  // });
  // if (response.ok) {
  //     // Handle successful login
  //     console.log('User logged in successfully!');
  //     const { accessToken, user } = await response.json();
  //     localStorage.setItem('accessToken', accessToken);
  //     return { user, accessToken};
  // } else {
  //     console.error('Login failed:', await response.text());
  // }

  // throw new Error('Login failed');
  // };
  