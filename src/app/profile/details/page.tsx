"use client"
import React from 'react'
import { User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootStateType } from '@/store/userStore';

function Details() {
  const user = useSelector((state:RootStateType) => state.user)
  console.log(user)
  return (
    <div className='overflow-hidden'>
        <div>
            <p className='p-4 text-[#ddd] text-2xl font-bold'>Profile</p>
        </div>
        <div className='p-6 mx-auto text-center'>
            <User size={'12rem'} strokeWidth={1} color='#bbb' className='rounded-full mx-auto bg-gray-500 cursor-pointer'/>
            <p className='text-md text-[#ddd]'>{user.email}</p>
        </div>

        <div className=' p-4'>
            <p className='text-md  text-white'>Your name</p>
            <p className='text-[#ccc] text-xl'>{user.username}</p>

            <p className='text-md text-white mt-6'>About</p>
            <p className='text-[#ccc] text-xl'>{user.about}</p>
        </div>
    </div>
  )
}

export default Details