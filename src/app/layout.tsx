"use client";
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import ToastProvider from '@/components/sonnerProvider';
import Options from '@/components/Options';
import { usePathname } from 'next/navigation';


interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  const isAuthRoute = pathname.match('/auth/');
  return (
    <html lang="en" >
      <body>
        { 
          isAuthRoute ? <div>{children}</div> : <div className="">
          <div className="bg-gray-500 w-1/16 h-screen p-3 float-left inline-block relative">
            <Options />
          </div>
        </div>
        }
      
        <ToastProvider />
          {children}
        </body>
    </html>
  );
}
