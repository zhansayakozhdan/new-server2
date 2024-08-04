import { Analytics } from "@vercel/analytics/react"

const Layout = ({children}: { children: React.ReactNode }) => {
    return (
        
        <div className="flex-center min-h-screen w-full bg-primary-50 bg-doted-pattern bg-cover bg-fixed bg-center">
            {children}
            <Analytics />
        </div>
    )
}

export default Layout