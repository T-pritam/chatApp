import React from 'react'
import { X } from 'lucide-react';
import { User } from 'lucide-react';

interface friendDetails{
  username: string,
  about: string,
  email: string,
  setDetails: React.Dispatch<React.SetStateAction<boolean>>
}

const UserDetails:React.FC<friendDetails> = ({username, about, email, setDetails}) => {
  return (
    <div className='bg-gray-950'>
        <div className='p-5 pl-7 bg-gray-700'>
            <X  color='#bbb'  className='text-white inline-block cursor-pointer' onClick={() => setDetails(false)}/>
            <p className='text-white inline-block ml-7'>Contact info</p>
            <User className='m-auto mt-10 bg-slate-500 rounded-full' size={200} />
            <div className='text-center'>
                <p className='mt-3 text-2xl font-normal text-[#bbb]'>{username}</p>
                <p className='mt-1 text-[#999]'>{email}</p>
            </div>
        </div>

        <div className='p-5 pl-7 mt-3 bg-gray-700'>
            <p className='text-[#999]'>About</p>
            <p className='text-[#bbb] text-xl font-normal'>{about}</p>
        </div>
    </div>
  )
}

export default UserDetails