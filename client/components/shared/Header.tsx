'use client'
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '../../contexts/AuthContext';
import NavItems from './NavItems';
import MobileNav from './MobileNav';

const Header = () => {
  const { isAuthenticated, user, logoutUser } = useAuth();

  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-48 flex items-center">
          <Image src="/assets/images/new-logo.svg" width={40} height={35} alt="Logo" className='h-auto'/>
          <h3 className="font-semibold text-xl ml-2">Tech Events</h3>
        </Link>

        <nav className="md:flex hidden w-full max-w-xs">
          <NavItems />
        </nav>

        <div className="flex w-32 justify-end gap-3">
          {!isAuthenticated ? (
            <Button className="rounded-full hidden md:inline-grid" size="lg" asChild>
              <Link href="/sign-in">Войти</Link>
            </Button>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer md:hidden">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.picture || '/assets/images/new-user.svg'} />
                      <AvatarFallback>{user?.initials || '?'}</AvatarFallback>
                      <span className="sr-only">Toggle user menu</span>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/profile" className="flex items-center gap-2" prefetch={false}>
                      <UserIcon className="h-4 w-4" />
                      <span>Ваш профиль</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={logoutUser} className="flex items-center gap-2">
                    <LogOutIcon className="h-4 w-4" />
                    <span>Выйти</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="md:flex items-center gap-2 cursor-pointer hidden">
                    <span className="p-medium-16 whitespace-nowrap">Мой профиль</span>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.picture || '/assets/images/new-user.svg'} />
                      <AvatarFallback>{user?.initials || '?'}</AvatarFallback>
                      <span className="sr-only">Toggle user menu</span>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/profile" className="flex items-center gap-2" prefetch={false}>
                      <UserIcon className="h-4 w-4" />
                      <span>Ваш профиль</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={logoutUser} className="flex items-center gap-2">
                    <LogOutIcon className="h-4 w-4" />
                    <span>Выйти</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;



// import React from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { Button } from '../ui/button';
// import NavItems from './NavItems';
// import MobileNav from './MobileNav';
// import {useAuth} from '../../hooks/authContext';

// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
// import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";



// const Header: React.FC = () => {
//   const { isAuthenticated } = useAuth();

//   return (
//     <header className="w-full border-b">
//       <div className="wrapper flex items-center justify-between">
//         <Link href="/" className="w-48 flex items-center">
//           <Image src="/assets/images/logo1.svg" width={40} height={35} alt="Logo" />
//           <h3 className="font-semibold text-xl ml-2">Tech Events</h3>
//         </Link>

//         <nav className="md:flex hidden w-full max-w-xs">
//           <NavItems />
//         </nav>

//         <div className="flex w-32 justify-end gap-3">
//           <MobileNav />
//           {!isAuthenticated && (
//             <Button className="rounded-full hidden md:inline-grid" size="lg" asChild>
//               <Link href="/sign-in">Login</Link>
//             </Button>
//           )}

//           {isAuthenticated && (
//             <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <div className='flex items-center gap-2 cursor-pointer'>
//             <span className="p-medium-16 whitespace-nowrap">My Profile</span>
//               <Avatar className="h-9 w-9">
//                 <AvatarImage src="/placeholder-user.jpg" />
//                 <AvatarFallback>ZK</AvatarFallback>
//                 <span className="sr-only">Toggle user menu</span>
//               </Avatar>
//               </div>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem>
//                 <Link href="#" className="flex items-center gap-2" prefetch={false}>
//                   <UserIcon className="h-4 w-4" />
//                   <span>Profile</span>
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>
//                 <Link href="#" className="flex items-center gap-2" prefetch={false}>
//                   <SettingsIcon className="h-4 w-4" />
//                   <span>Settings</span>
//                 </Link>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>
//                 <Link href="#" className="flex items-center gap-2" prefetch={false}>
//                   <LogOutIcon className="h-4 w-4" />
//                   <span>Logout</span>
//                 </Link>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//           )}

//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;


function LogOutIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}


function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}


function UserIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}


