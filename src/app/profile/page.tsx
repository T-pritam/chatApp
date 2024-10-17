import ChatList from '@/components/ChatList';
import Settings from '@/components/Settings';

export default async function Profile(){
  return (
           <div className='flex'>
            <div className="bg-gray-700 w-2/5 h-screen inline-block relative">
              <Settings />
            </div>           
           </div>
  );
}

