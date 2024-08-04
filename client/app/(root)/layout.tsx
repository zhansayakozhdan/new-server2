import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import { AuthProvider } from '../../contexts/AuthContext'; 
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <AuthProvider>
      <div className="flex h-screen flex-col">
        <Header/>
        <main className="flex-1">
          {children}
        <Analytics />
        </main>
        <Footer/>
     </div>
     </AuthProvider>
    );
  }