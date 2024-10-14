import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import ToastProvider from '@/components/sonnerProvider';
import Options from '@/components/Options';
import ChatList from '@/components/ChatList';
import ChatMessage from '@/components/ChatMessage';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" >
      <body>
      <div className="flex ">
        <div className="bg-gray-500 w-16 h-screen p-3">
          <Options />
        </div>
        
        
        <div className="bg-gray-700 w-2/5 h-screen p-4">
          <ChatList />
        </div>
          
        
        <div className="bg-gray-500 flex-1 h-screen">
          <ChatMessage />
        </div>
      </div>
        <ToastProvider />
          {children}
        </body>
    </html>
  );
}

