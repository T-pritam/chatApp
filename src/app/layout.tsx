import { useEffect } from 'react';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import ToastProvider from '@/components/sonnerProvider';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" >
      <body>
        <ToastProvider />
          {children}
        </body>
    </html>
  );
}

