import ChatList from '@/components/ChatList';
import Common from '@/components/Common';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
           <div>
            {children}
           </div>
  );
}