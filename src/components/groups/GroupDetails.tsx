import React from 'react'
import { X } from 'lucide-react';
import { User } from 'lucide-react';
import { UserState } from '@/store/userSlice';

interface friendDetails{
  name: string,
  description: string,
  members: UserState[],
  setDetails: React.Dispatch<React.SetStateAction<boolean>>,
  createdBy: UserState,
  createdAt: string
}

const GroupDetails:React.FC<friendDetails> = ({name, description, members, setDetails, createdBy, createdAt}) => {
  return (
    <div className='bg-gray-950'>
        <div className='p-5 pl-7 bg-gray-700'>
            <X  color='#bbb'  className='text-white inline-block cursor-pointer' onClick={() => setDetails(false)}/>
            <p className='text-white inline-block ml-7'>Contact info</p>
            <User className='m-auto mt-10 bg-slate-500 rounded-full' size={200} />
            <div className='text-center'>
                <p className='mt-3 text-2xl font-normal text-[#bbb]'>{name}</p>
                <p className='mt-1 text-[#999]'>{members.length} members</p>
            </div>
        </div>

        <div className='p-5 pl-7 mt-3 bg-gray-700'>
            <p>Group created by {createdBy.username}, on {new Date(createdAt).toLocaleDateString()} at {new Date(createdAt).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</p>
            <p className='text-[#999]'>About</p>
            <p className='text-[#bbb] text-xl font-normal'>{description}</p>
        </div>
    </div>
  )
}

export default GroupDetails