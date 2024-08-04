'use client'
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';


const ProfileComponent: React.FC = () => {
  const { user } = useAuth();
  console.log("User in ProfileComponent:", user); // Add this log to verify

  return (
    <div>
      <h1>User Profile</h1>
      {user ? (
        <div>
          <p>User ID: {user._id}</p>
          <p>Email: {user.email}</p>
          <p>Username: {user.username}</p>
        </div>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
};

export default ProfileComponent;
