'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/contexts/AuthContext";


const Login = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();
    const { isAuthenticated, loginWithGoogle, logoutUser, loginUser } = useAuth();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); // Prevent default form submission
      setLoading(true);
      try {
        //   const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/login`, {
        //       method: 'POST',
        //       headers: {
        //           'Content-Type': 'application/json',
        //       },
        //       body: JSON.stringify({ email, password }),
        //       credentials: 'include' // Ensure cookies are included in the request
        //   });
        //   if (response.ok) {
        //       // Handle successful login
        //       console.log('User logged in successfully!');
        //       const data = await response.json();
        //       localStorage.setItem('accessToken', data.accessToken);
        //       localStorage.setItem('refreshToken', data.refreshToken);
        //       router.push('/');
        //   } else {
        //       console.error('Login failed:', await response.text());
        //   }

        loginUser(email, password);
        router.push('/');

      } catch (error) {
          console.error('Error during login:', error);
      } finally {
          setLoading(false);
      }
  };


//   const handleGoogleLogin = () => {
//     setLoading(true);
//     window.location.href = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/google`;
// };



    return (
        <div className="flex min-h-[80dvh] items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center space-y-2">
          <ChromeIcon className="h-12 w-12" />
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Войти через Google</h2>
          <p className="text-muted-foreground text-center">
          Для добавления мероприятий в Google Календарь, нужно предоставить доступ к вашему календарю. 
          </p>
        </div>
        <Button variant="outline" className="w-full flex items-center justify-center gap-2"
         onClick={loginWithGoogle} disabled={loading} type="button">
                        <ChromeIcon className="h-5 w-5" />
                        {loading ? 'Вход...' : 'Войти через Google'}
        </Button>
      </div>
    </div>


        // <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        //     <div className="mx-auto w-full max-w-md space-y-6">
        //         <div className="space-y-2 text-center">
        //             <h1 className="text-3xl font-bold tracking-tight text-foreground">Войти</h1>
        //             <p className="text-muted-foreground">Введите ваш адрес электронной почты и пароль.</p>
        //         </div>
        //         <form onSubmit={handleLogin}>
        //         <div className="space-y-4">
        //             <div className="space-y-2">
        //                 <Label htmlFor="email">Email</Label>
        //                 <Input id="email" type="email" placeholder="madina@example.com" required 
        //                 value={email}
        //                 onChange={(e) => setEmail(e.target.value)}/>
        //             </div>
        //             <div className="space-y-2">
        //                 <Label htmlFor="password">Пароль</Label>
        //                 <Input id="password" type="password" required 
        //                 value={password}
        //                 onChange={(e) => setPassword(e.target.value)}/>
        //             </div>
        //             <Button type="submit" className="w-full" disabled={loading}>
        //                     {loading ? 'Вход...' : 'Войти'}
        //                 </Button>
        //             <Button variant="outline" className="w-full" onClick={loginWithGoogle} disabled={loading} type="button">
        //                 <ChromeIcon className="mr-2 h-4 w-4" />
        //                 {loading ? 'Вход...' : 'Войти через Google'}
        //             </Button>
        //         </div>
        //         </form>
        //         <div className="text-center">
        //             <p className="text-muted-foreground text-sm">
        //             Ещё нет аккаунта?{" "}
        //                 <Link href="/sign-up" className="font-medium underline text-sm" prefetch={false}>
        //                 Зарегестрироваться
        //                 </Link>
        //             </p>
        //         </div>
        //     </div>
        // </div>
    );
};

export default Login;

interface SvgIconProps extends React.SVGProps<SVGSVGElement> { }

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
    );
}


// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"

// const Login: React.FC = () => {
//   const [loading, setLoading] = useState(false);
//   const [isMounted, setIsMounted] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const handleLogin = async () => {
//     if (!isMounted) return;
//     setLoading(true);
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/google-auth/auth/google`, {
//         method: 'GET',
//         redirect: 'manual',
//       });
//       if (response.status === 200) {
//         const { url } = await response.json();
//         router.push(url);
//       } else {
//         console.error('Failed to redirect to Google login');
//         alert('Failed to redirect to Google login');
//       }
//     } catch (error) {
//       console.error('Error during Google login:', error);
//       alert('Error during Google login');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     // <div className="login-container">
//     //   <h2>Login Page</h2>
//     //   <button onClick={handleLogin} disabled={loading}>
//     //     {loading ? 'Logging in...' : 'Login with Google'}
//     //   </button>
//     // </div>

//     <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
//     <div className="mx-auto w-full max-w-md space-y-6">
//       <div className="space-y-2 text-center">
//         <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign in to your account</h1>
//         <p className="text-muted-foreground">Enter your email and password below to access your account.</p>
//       </div>
//       <div className="space-y-4">
//         <div className="space-y-2">
//           <Label htmlFor="email">Email</Label>
//           <Input id="email" type="email" placeholder="m@example.com" required />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="password">Password</Label>
//           <Input id="password" type="password" required />
//         </div>
//         <Button type="submit" className="w-full">
//           Sign in
//         </Button>
//         <Button variant="outline" className="w-full" onClick={handleLogin} disabled={loading}>
//           <ChromeIcon className="mr-2 h-4 w-4" />
//           {loading ? 'Logging in...' : 'Sign in with Google'}
//         </Button>
//       </div>
//       <div className="text-center">
//         <p className="text-muted-foreground">
//           New to Devpost?{" "}
//           <Link href="#" className="font-medium underline" prefetch={false}>
//             Sign up for an account
//           </Link>
//         </p>
//       </div>
//     </div>
//   </div>
// )
// }



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


