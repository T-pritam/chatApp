"use client"

import React from 'react'
import { X } from 'lucide-react';
import { User } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import { useState } from 'react';

interface friendDetails{
  username: string,
  about: string,
  email: string,
  profileImgUrl: string
  setDetails: React.Dispatch<React.SetStateAction<boolean>>
}

const UserDetails:React.FC<friendDetails> = ({username, about, email, setDetails,profileImgUrl}) => {
  const [showImg,setShowImg] = useState<boolean>(false);

  return (
    <div className='bg-gray-950'>
      {
        showImg
        ? <div className="w-screen h-10/12 fixed inset-0 bg-gray-800 z-50 p-6" onClick= { () => setShowImg(false)}>
             <X  color='#bbb' size={28}  className='text-white inline-block cursor-pointer' onClick={() => setShowImg(false)}/>
            <CldImage src={profileImgUrl} width={700} height={700} alt="profile img" className='h-[400px] w-[400px] m-auto mt-10 object-cover rounded cursor-pointer' onClick={(event) => event.stopPropagation()} />
          </div>
        : null
      }
        <div className='p-5 pl-7 bg-gray-700'>
            <X  color='#bbb'  className='text-white inline-block cursor-pointer' onClick={() => setDetails(false)}/>
            <p className='text-white inline-block ml-7'>Contact info</p>
            {
              profileImgUrl != null
              ? <CldImage src={profileImgUrl} width={200} height={200} alt="profile img" className='h-[200px] w-[200px] m-auto mt-10 object-cover rounded-full cursor-pointer' onClick={(event) => {
                event.stopPropagation();
                setShowImg(true);
              }} />
              : <User className='m-auto mt-10 bg-slate-500 rounded-full' size={200} />
            }
            
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