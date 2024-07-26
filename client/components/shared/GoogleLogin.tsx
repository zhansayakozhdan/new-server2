import React from 'react';
import axios from 'axios';

const GoogleLogin: React.FC = () => {
  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get<{ message: string; id: string }>('http://localhost:5000/api/auth/google');
      console.log(response.data);
      // Redirect or handle success as needed
    } catch (error: any) {
      console.error('Google login error:', error.response?.data);
    }
  };

  return (
    <button onClick={handleGoogleLogin}>Login with Google</button>
  );
};

export default GoogleLogin;
