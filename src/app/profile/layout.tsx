"use client"
import Common from '@/components/Common';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
           <div className='flex'>
            <div className="bg-gray-700 w-2/5 h-screen inline-block relative">
              {children}
            </div>
            <div className="bg-gray-500 flex-1 h-screen inline-block relative">
              <Common />
            </div>
           </div>
  );
}

