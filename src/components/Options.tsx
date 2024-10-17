"use client"

import React from 'react'
import { MessageSquareMore } from 'lucide-react';
import { User } from 'lucide-react';
import { IoSettingsOutline } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BiSolidMessageAltDetail } from "react-icons/bi";
import { BiMessageAltDetail } from "react-icons/bi";

function Options() {
  const router = useRouter()
  const [settingBtnselect, setSettingBtnselect] = useState(false)
  const [messageBtnselect, setMessageBtnselect] = useState(true)

  const handleSettingBtn = () => {
    setSettingBtnselect(!settingBtnselect)
  }

  const handleMessageBtn = () => {
    setMessageBtnselect(!messageBtnselect)
  }

  return (
    <div className='flex items-center justify-center flex-col  h-full'>
    <div className="flex flex-col justify-between items-center h-full">
    
    
    <div className="space-y-5">
    <div onClick={handleMessageBtn}>
        {
          messageBtnselect 
          ? <div>
            <BiSolidMessageAltDetail size={34} color='#ccc' className='mx-auto p-1 rounded-full bg-gray-700 cursor-pointer focus:outline-none'/> 
          </div>
          : <BiMessageAltDetail size={34} color='#bbb' className='mx-auto pd-2 cursor-pointer focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50' onClick={() => router.push('/chat')}/>
        }
      </div>

        <MessageSquareMore size={26} stroke='#bbb' className='mx-auto cursor-pointer'/>
        <MessageSquareMore size={36} stroke='#bbb' className='cursor-pointer'/>
        <MessageSquareMore size={36} stroke='#bbb' className='cursor-pointer'/>
        <MessageSquareMore size={36} stroke='#bbb' className='cursor-pointer'/>
    </div>

    
    <div className="space-y-6">
      <div onClick={handleSettingBtn}>
        {
          settingBtnselect 
          ? <div>
            <IoSettingsSharp size={34} color='#ccc' className='mx-auto p-1 rounded-full bg-gray-700 cursor-pointer focus:outline-none'/>
          </div>
          : <IoSettingsOutline size={34} stroke='#bbb' className='mx-auto pd-2 cursor-pointer focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50' onClick={() => router.push('/profile/settings')}/>
        }
      </div>
      <User size={34} strokeWidth={1} color='#bbb' className='rounded-full bg-gray-700 cursor-pointer'/>
    </div>

      </div>    
    </div>
  )
}

export default Options