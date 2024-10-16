"use client";
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import ToastProvider from '@/components/sonnerProvider';
import Options from '@/components/Options';
import { usePathname } from 'next/navigation';
import {store} from "../store/userStore"
import { Provider } from "react-redux";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthRoute = pathname.match('/auth/');

  useEffect(() => {
    if(!localStorage.getItem("token")){
      router.push("/auth/signin") 
    }
  },[])
  return (
    <html lang="en" >
      <body>
        { 
          isAuthRoute ? <div>
            <Provider store={store}>
              {children}
            </Provider>
            </div> : <div className="">
            <div className="bg-gray-500 w-1/16 h-screen p-3 float-left inline-block relative">
            <Options />
          </div>
        </div>
        }
      
        <ToastProvider />
          <Provider store={store}>
            {children}
          </Provider>
        </body>
    </html>
  );
}
