import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@radix-ui/react-separator"
import Image from "next/image"
import NavItems from "./NavItems"
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link'


const MobileNav = () => {
    const { isAuthenticated, user, logoutUser } = useAuth();
    return (
        <nav className="md:hidden">
            <Sheet>
                <SheetTrigger className="align-middle">
                    <Image 
                        src="/assets/icons/menu.svg"
                        alt="menu"
                        width={40}
                        height={35}
                        className="cursor-pointer h-auto"
                    />
                </SheetTrigger>
                <SheetContent className="flex flex-col gap-6 bg-white md:hidden ">
                    <SheetHeader className="flex flex-row">
                    <Image
                        src="/assets/images/new-logo.svg" alt="logo" width={40} height={35}/>
                        <SheetTitle className="ml-3">Tech Events</SheetTitle>
                    </SheetHeader>
                    <Separator className="border border-gray-50"/>
                    <NavItems/>
                    <Separator className="border border-gray-50"/>
            {!isAuthenticated && (
            <li
            className='flex-start p-medium-16 whitespace-nowrap'
            >
            <Link href="/sign-in">Войти</Link>
        </li>
          )}
                </SheetContent>
            </Sheet>

        </nav>
    )
}

export default MobileNav
