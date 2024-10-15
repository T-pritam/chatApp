import React from 'react'
import { X } from 'lucide-react';
import { User } from 'lucide-react';

function UserDetails() {
  return (
    <div className='bg-gray-950'>
        <div className='p-5 pl-7 bg-gray-700'>
            <X  color='#bbb'  className='text-white inline-block cursor-pointer'/>
            <p className='text-white inline-block ml-7'>Contact info</p>
            <User className='m-auto mt-10 bg-slate-500 rounded-full' size={200} />
            <div className='text-center'>
                <p className='mt-3 text-2xl font-normal text-[#bbb]'>Username</p>
                <p className='mt-1 text-[#999]'>User@mail.com</p>
            </div>
        </div>

        <div className='p-5 pl-7 mt-3 bg-gray-700'>
            <p className='text-[#999]'>About</p>
            <p className='text-[#bbb] text-xl font-normal'>About dfgd kgj djg sldjg jdg sdgjlsdg </p>
        </div>
    </div>
  )
}

export default UserDetails