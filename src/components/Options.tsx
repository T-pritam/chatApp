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
import { FaUserFriends } from "react-icons/fa";
import { MdGroups } from "react-icons/md";

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
    <div onClick={handleMessageBtn} className='group'>
        {
          messageBtnselect 
          ? <div>
            <BiSolidMessageAltDetail size={34} color='#ccc' className='mx-auto p-1 rounded-full bg-gray-700 cursor-pointer focus:outline-none'/> 
          </div>
          : <BiMessageAltDetail size={34} color='#bbb' className='mx-auto pd-2 cursor-pointer focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50' onClick={() => router.push('/chat')}/>
        }
        <span className="absolute left-24 top-2 transform -translate-x-1/2 mt-2 p-1 px-4 rounded-xl bg-[#eee] text-black text-center text-sm z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chats
        </span>
      </div>
      <div className='group'>
      <FaUserFriends size={36} color='#bbb' className='cursor-pointer' onClick={() => router.push('/friends')} />
        <span className="absolute left-24 top-16 transform -translate-x-1/2 mt-2 p-1 px-4 rounded-xl bg-[#eee] text-black text-center text-sm z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Friends
        </span>
      </div>

      <div className='group'>
          <MdGroups size={36} color='#bbb' className='cursor-pointer' onClick={() => router.push('/groups')} />
          <span className="absolute left-24 top-[7.40rem] transform -translate-x-1/2 mt-2 p-1 px-4 rounded-xl bg-[#eee] text-black text-center text-sm z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              Groups
          </span>
        </div>
    </div>

    
      <div className="space-y-6">
        <div onClick={handleSettingBtn} className='group'>
          {
            settingBtnselect 
            ? <div>
              <IoSettingsSharp size={34} color='#ccc' className='mx-auto p-1 rounded-full bg-gray-700 cursor-pointer focus:outline-none'/>
            </div>
            : <IoSettingsOutline size={34} stroke='#bbb' className='mx-auto pd-2 cursor-pointer focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50' onClick={() => router.push('/profile/settings')}/>
          }
          <span className="absolute left-24 bottom-[4.5rem] transform -translate-x-1/2 mt-2 p-1 px-4 rounded-xl bg-[#eee] text-black text-center text-sm z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Settings
        </span>
        </div>
        <div className='group'>
          <User size={34} strokeWidth={1} color='#bbb' className='rounded-full bg-gray-700 cursor-pointer' onClick={() => router.push('/profile/details')}/>
          <span className="absolute left-24 bottom-4 transform -translate-x-1/2 mt-2 p-1 px-4 rounded-xl bg-[#eee] text-black text-center text-sm z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Profile
          </span>
        </div>
        
      </div>

      </div>    
    </div>
  )
}

export default Options