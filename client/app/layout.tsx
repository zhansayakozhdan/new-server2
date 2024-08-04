import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
// import { AuthProvider } from '@/hooks/authContext';
import { AuthProvider } from '../contexts/AuthContext'; 
import { Analytics } from "@vercel/analytics/react"

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: "Tech Events",
  description: "Tech Events",
  icons: {
    icon: '/assets/images/new-logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
    <html lang="en">
      <body className={poppins.variable}>
        {children}
      <Analytics />
      </body>
    </html>
    </AuthProvider>
  );
}
