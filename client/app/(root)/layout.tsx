import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import { AuthProvider } from '../../contexts/AuthContext'; 

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <AuthProvider>
      <div className="flex h-screen flex-col">
        <Header/>
        <main className="flex-1">{children}</main>
        <Footer/>
     </div>
     </AuthProvider>
    );
  }