"use client"
import { useState } from 'react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: any) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/v1/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
                credentials: 'include' // Ensure cookies are included in the request
            });
            if (response.ok) {
                // Handle successful signup
                console.log('User signed up successfully!');
            } else {
                console.error('Signup failed:', await response.text());
            }
        } catch (error) {
            console.error('Error during signup:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Signup Page</h2>
            <form onSubmit={handleSignup}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Signing up...' : 'Signup'}
                </button>
            </form>
        </div>
    );
};

export default Signup;

// "use client"
// import React, { useState } from 'react';
// import axios from 'axios';

// const Signup: React.FC = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post<{ message: string; id: string }>('http://localhost:5000/api/v1/user/signup', { name, email, password });
//       console.log(response.data);
//       // Redirect or handle success as needed
//     } catch (error: any) {
//       console.error('Signup error:', error.response?.data);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
//       <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//       <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//       <button type="submit">Signup</button>
//     </form>
//   );
// };

// export default Signup;


// // import React from 'react'

// // const SignUp = () => {
// //   return (
// //     <div>
      
// //     </div>
// //   )
// // }

// // export default SignUp
