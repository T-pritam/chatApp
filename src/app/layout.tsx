"use client";

import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import ToastProvider from '@/components/sonnerProvider';
import Options from '@/components/Options';
import { usePathname } from 'next/navigation';
import {store} from "../store/userStore"
import { Provider } from "react-redux";
import { useEffect,useState } from 'react';
import { useRouter } from 'next/navigation';
import {PusherContextProvider} from '@/context/PusherContextProvider';
// import { setupPusherConnection } from '@/lib/pusher';


interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthRoute = pathname.match('/auth/');
  

  useEffect(() => {
    // setupPusherConnection()
    const token = localStorage.getItem('token')
    if(!token){
      router.push("/auth/signin") 
    }
  },[])

  return (
    <html lang="en" >
      <body>
        { 
          isAuthRoute ? <div>
            <Provider store={store}>
              <PusherContextProvider>
                {children}
              </PusherContextProvider>
            </Provider>
            </div> : <div className="">
            <div className="bg-gray-500 w-1/16 h-screen p-3 float-left inline-block relative">
            <Options />
          </div>
        </div>
        }
      
        <ToastProvider />
          <Provider store={store}>
            <PusherContextProvider>
              {children}
            </PusherContextProvider>
          </Provider>
        </body>
    </html>
  );
}
