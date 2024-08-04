import { Analytics } from "@vercel/analytics/react"
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

const Layout = ({children}: { children: React.ReactNode }) => {
    return (
        
        <div className="flex h-screen flex-col">
        <Header/>
          {children}
        <Analytics />
        
        <Footer/>
     </div>
    )
}

export default Layout