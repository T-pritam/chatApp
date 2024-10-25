"use client"

import React from 'react'
import { useSelector } from 'react-redux'
import { RootStateType } from '@/store/userStore'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { Search, User } from 'lucide-react';
import { UserState } from '@/store/userSlice'


function Friends(props : { searchText : string }) {
    const user = useSelector((state:RootStateType) => state.user)
    const friends = useSelector((state:RootStateType) => state.friends)
    const [friendsList,setFriendsList] = useState<UserState[] >([])


    useEffect(() => {
        console.log("Search text :", props.searchText)
        const fetchFriends = friends.friends.filter((f) => f.username.toLowerCase().includes(props.searchText.toLowerCase()))
        console.log("fetch : ",fetchFriends)
        if(props.searchText == "") {
            setFriendsList(friends.friends)
        }
        setFriendsList(fetchFriends)
        
    },[props.searchText])

    useEffect(() => {
        setFriendsList(friends.friends)
    },[])

  return (
    <div>
        {
            friendsList.length == 0 
            ? <p className='text-[#aaa] text-xl my-auto text-center mt-24'>No Friends</p>
            : friendsList.map((users) => (
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