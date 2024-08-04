// "use client"
// import { useState } from 'react';

// const Signup = () => {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleSignup = async (e: any) => {
//         e.preventDefault(); // Prevent default form submission
//         setLoading(true);
//         try {
//             const response = await fetch('http://localhost:5000/api/v1/signup', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ name, email, password }),
//                 credentials: 'include' // Ensure cookies are included in the request
//             });
//             if (response.ok) {
//                 // Handle successful signup
//                 console.log('User signed up successfully!');
//             } else {
//                 console.error('Signup failed:', await response.text());
//             }
//         } catch (error) {
//             console.error('Error during signup:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div>
//             <h2>Signup Page</h2>
//             <form onSubmit={handleSignup}>
//                 <input
//                     type="text"
//                     placeholder="Name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />
//                 <button type="submit" disabled={loading}>
//                     {loading ? 'Signing up...' : 'Signup'}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default Signup;

// // "use client"
// // import React, { useState } from 'react';
// // import axios from 'axios';

// // const Signup: React.FC = () => {
// //   const [name, setName] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');

// //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();
// //     try {
// //       const response = await axios.post<{ message: string; id: string }>('http://localhost:5000/api/v1/user/signup', { name, email, password });
// //       console.log(response.data);
// //       // Redirect or handle success as needed
// //     } catch (error: any) {
// //       console.error('Signup error:', error.response?.data);
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit}>
// //       <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
// //       <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
// //       <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
// //       <button type="submit">Signup</button>
// //     </form>
// //   );
// // };

// // export default Signup;

'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from "@/contexts/AuthContext";

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { isAuthenticated, loginWithGoogle, logoutUser, loginUser } = useAuth();

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
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

    // const handleGoogleSignUp = () => {
    //     setLoading(true);
    // window.location.href = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/google`;
    // };

    return (
        <div className="flex justify-center items-center h-screen bg-background">
            <Card className="w-[380px] py-5">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Регистрация</CardTitle>
                    <CardDescription>Создать аккаунт.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <Button variant="outline" onClick={loginWithGoogle} type="button">
                            <ChromeIcon className="mr-2 h-4 w-4" />
                            продолжить с Google
                        </Button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-muted" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Или</span>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="madina@gmail.com" required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Пароль</Label>
                        <Input id="password" type="password" required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Регистрация…' : 'Зарегистрироваться'}
                    </Button>
                </CardFooter>
                </form>
                <div className="text-center">
                    <p className="text-muted-foreground text-sm">
                    Уже есть аккаунт?{" "}
                        <Link href="/sign-in" className="font-medium underline text-sm" prefetch={false}>
                        Войти
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    )
};

export default SignUp;


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
    )
  }
