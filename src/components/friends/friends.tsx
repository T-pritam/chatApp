"use client"

import React from 'react'
import { useSelector } from 'react-redux'
import { RootStateType } from '@/store/userStore'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { UserType } from '@/model/User'
import { User } from 'lucide-react';
import { set } from 'mongoose'

function Friends() {
    const user = useSelector((state:RootStateType) => state.user)
    const friends = useSelector((state:RootStateType) => state.friends)
    console.log("Friends final : ",friends.friends)

  return (
    <div>
        {
            friends.friends.length == 0 
            ? <p className='text-[#aaa] text-xl my-auto text-center mt-24'>No Friends</p>
            : friends.friends.map((users) => (
                <div className='flex justify-start p-3 gap-3 hover:bg-gray-500'>
                    <User size={48} strokeWidth={1} color='#bbb' className='rounded-full bg-gray-500 cursor-pointer mt-1'/>
                    <div className='flex w-11/12 justify-between'>
                        <p className='text-white text-xl my-auto'>{users.username}</p>
                        <button className='py-0 pl-2 pr-2 bg-gray-600 rounded-xl text-[#bbb] z-10' onClick={async() => {
                            const res = await axios.post('/api/friendReq/add', {sender : user._id, reciever : users._id})

                        }}>Friends</button>
                    </div>
                </div>
            ))
        } 
        
    </div>
  )
}

export default Friends