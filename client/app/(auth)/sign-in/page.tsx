'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = async () => {
    if (!isMounted) return;
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/google-auth/auth/google`, {
        method: 'GET',
        redirect: 'manual',
      });
      if (response.status === 200) {
        const { url } = await response.json();
        router.push(url);
      } else {
        console.error('Failed to redirect to Google login');
        alert('Failed to redirect to Google login');
      }
    } catch (error) {
      console.error('Error during Google login:', error);
      alert('Error during Google login');
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="login-container">
    //   <h2>Login Page</h2>
    //   <button onClick={handleLogin} disabled={loading}>
    //     {loading ? 'Logging in...' : 'Login with Google'}
    //   </button>
    // </div>

    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign in to your account</h1>
        <p className="text-muted-foreground">Enter your email and password below to access your account.</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
        <Button variant="outline" className="w-full" onClick={handleLogin} disabled={loading}>
          <ChromeIcon className="mr-2 h-4 w-4" />
          {loading ? 'Logging in...' : 'Sign in with Google'}
        </Button>
      </div>
      <div className="text-center">
        <p className="text-muted-foreground">
          New to Devpost?{" "}
          <Link href="#" className="font-medium underline" prefetch={false}>
            Sign up for an account
          </Link>
        </p>
      </div>
    </div>
  </div>
)
}

export default Login;


function ChromeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  )
}


function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}


// "use client"
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// const Login = () => {
//     const [loading, setLoading] = useState(false);
//     const [isMounted, setIsMounted] = useState(false);
//     const router = useRouter();

//     useEffect(() => {
//         setIsMounted(true); // Set the mounted state to true once the component has mounted
//     }, []);

//     const handleLogin = async () => {
//         if (!isMounted) return; // Ensure the component is mounted before attempting to navigate
//         setLoading(true);
//         try {
//             const response = await fetch('http://localhost:5000/api/v1/google-auth/auth/google', {
//                 method: 'GET',
//                 redirect: 'manual' // Prevent automatic redirection
//             });
//             if (response.status === 200) {
//                 const { url } = await response.json(); // Expect the URL from the server response
//                 router.push(url); // Redirect using the client-side router
//             } else {
//                 console.error('Failed to redirect to Google login');
//             }
//         } catch (error) {
//             console.error('Error during Google login:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div>
//             <h2>Login Page</h2>
//             <button onClick={handleLogin} disabled={loading}>
//                 {loading ? 'Logging in...' : 'Login with Google'}
//             </button>
//         </div>
//     );
// };

// export default Login;



// "use client"
// import React, { useState } from 'react';
// import axios from 'axios';

// const Login: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post<{ message: string; id: string }>('http://localhost:5000/api/v1/user/login', { email, password });
//       console.log(response.data);
//       // Redirect or handle success as needed
//     } catch (error: any) {
//       console.error('Login error:', error.response?.data);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//       <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//       <button type="submit">Login</button>
//     </form>
//   );
// };

// export default Login;



// // import React from 'react'

// // const SignIn = () => {
// //   return (
// //     <div>
      
// //     </div>
// //   )
// // }

// // export default SignIn
