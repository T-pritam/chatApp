"use client"
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default async function SettingsPage(){
    const router = useRouter();
  return (
    <div className='overflow-hidden'>
    <div className='p-4'>
        <p className='text-2xl font-medium text-[#ddd]'>
            Settings
        </p>
    </div>
        <div className='flex justify-start p-3 gap-3 hover:bg-gray-500 w-screen cursor-pointer' onClick={() => router.push('/profile/details')}>
            <User size={'7vw'} strokeWidth={1} color='#bbb' className='rounded-full bg-gray-500 cursor-pointer mt-1'/>
            <div className='my-auto'>
                <p className='text-white text-xl'>John</p>
                <p className='text-[#ccc] text-sm'>Hello jogn hw are you?</p>
            </div>
        </div>
</div>
  );
}

