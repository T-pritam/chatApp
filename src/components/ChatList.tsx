"use client"
import React from 'react'
import { LogOut } from 'lucide-react';
import { Search } from 'lucide-react';
import { User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootStateType } from '@/store/userStore';
import {useState,useEffect } from 'react';
import '../components/css/scrollbar.css';
import { IoClose } from "react-icons/io5";
import { UserState } from '@/store/userSlice';
import { updateMessage } from '@/store/chatListSlice';
import formatDateString from '@/lib/formatDate';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { fetchChatListById } from '@/store/chatListSlice';
import { AppDispatch } from '@/store/userStore';
import { useDispatch } from 'react-redux';
import { IoCamera } from "react-icons/io5";
import { TiDocumentText } from "react-icons/ti";
import { IoMdVideocam } from "react-icons/io";
import { pusherClient } from '@/lib/pusher';
import axios from 'axios';

function ChatList() {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const friends = useSelector((state:RootStateType) => state.friends)
    const users = useSelector((state:RootStateType) => state.user)
    const chatList = useSelector((state:RootStateType) => state.chatList)
    const [friendsList,setFriendsList] = useState<UserState []>([])
    const [searchBtn,setSearchBtn] = useState<string>("")
    const [searchText,setSearchText] = useState<string>("")
    const [debouncedSearchText] = useDebounce(searchBtn, 800);

    useEffect(() => {
        dispatch(fetchChatListById(users._id))    
    },[users])

    useEffect(() => {
        setSearchText(debouncedSearchText.trim())
    },[debouncedSearchText])

    useEffect(() => {
        setFriendsList(friends.friends)
    },[friends.friends])

    useEffect(() => {
        const fetchFriends = friends.friends.filter((f) => f.username.toLowerCase().includes(searchText.toLowerCase()))
        if(searchText.trim() == "") {
            setFriendsList(friends.friends)
        } else {
            setFriendsList(fetchFriends)
        }
        console.log("fetch : ",fetchFriends)
    },[searchText])

    
  return (
    <div className=' border border-gray-500 h-screen overflow-y-scroll scrollbar-thin' >
        <div className='sticky top-0 z-10 bg-gray-700 pb-2 p-4'>
            <div className='flex justify-between'>
                <p className='text-2xl font-bold text-white'>Chats</p>
                <LogOut color='#bbb' className='cursor-pointer select-bg-red-600' onClick={() => {
                    localStorage.removeItem('token')
                    router.push('/auth/signin')
                }}/>
            </div>  

            <div className='mt-6 bg-gray-500 rounded-xl'>
                
                <Search size={20} stroke='#bbb' className='inline-block absolute ml-4 mt-2'/>
                <input type="text" value={searchBtn} className='w-full h-9 bg-gray-500 p-1 px-14 rounded-xl outline-none' placeholder='Search' onChange={(e) => setSearchBtn(e.target.value)}/>
                {
                    searchBtn.trim() == ""
                    ? null
                    : <IoClose size={20} color='#bbb' className='absolute right-6 inline-block mt-2 cursor-pointer' onClick={() => {
                        setSearchBtn("")
                        console.log("searchBtn Cleared : ",searchBtn)
                    }}/>
                }
                
            </div>

            <div className='flex justify-start mt-3 gap-3'>
                <button className=' p-1 pl-2 pr-2 bg-gray-600 rounded-xl text-[#bbb] hover:bg-gray-500/55'>All</button>
                <button className=' p-1 pl-2 pr-2 bg-gray-600 rounded-xl text-[#bbb] hover:bg-gray-500/55'>Unread</button>
                <button className=' p-1 pl-2 pr-2 bg-gray-600 rounded-xl text-[#bbb] hover:bg-gray-500/55'>Groups</button>
            </div>

        </div>
        
        {chatList.data.map((chat, index) => (
        <div key={index}>
          {"friendId" in chat ? (
            <div onClick={() => router.push(`/chat/${chat.friendId._id}`)}>
                    <div className='flex justify-start p-3 gap-3 hover:bg-gray-500'>
                        <User size={48} strokeWidth={1} color='#bbb' className='rounded-full bg-gray-500 cursor-pointer mt-1'/>
                        <div className='w-5/6'>
                            <div className='flex justify-between items-center'>
                                <p className='text-white text-xl'>{chat.friendId.username}</p>
                                {
                                    chat.lastMessageTime == null
                                    ? null
                                    : <p className='text-white text-xs'>{formatDateString(chat.lastMessageTime)}</p>
                                }
                            </div>
                            {
                                chat.lastMessageType?.includes("image")
                                ? <p className='text-white text-sm'><IoCamera size={24} color='#ddd'/> {chat.lastMessage}</p>
                                : chat.lastMessageType?.includes("video") 
                                ? <p className='text-white text-sm'><IoMdVideocam /> {chat.lastMessage}</p>
                                : chat.lastMessageType?.includes("document")
                                ? <p className='text-white text-sm'><TiDocumentText /> {chat.lastMessage}</p>
                                : <p className='text-white text-sm'>{chat.lastMessage}</p>
                            }
                        </div>
                    </div>
                    <hr className=" ml-14 border-gray-600 border-t" />
            </div>
          ) : "groupId" in chat ? (
            <div onClick={() => router.push(`/chat/group/${chat.groupId._id}`)}>
              <div className='flex justify-start p-3 gap-3 hover:bg-gray-500'>
                        <User size={48} strokeWidth={1} color='#bbb' className='rounded-full bg-gray-500 cursor-pointer mt-1'/>
                        <div className='w-5/6'>
                            <div className='flex justify-between items-center'>
                                <p className='text-white text-xl'>{chat.groupId.name}</p>
                                {
                                    chat.lastMessageTime == null
                                    ? null
                                    : <p className='text-white text-xs'>{formatDateString(chat.lastMessageTime)}</p>
                                }
                            </div>
                            {
                                chat.lastMessage == null
                                ? null
                                : chat.lastMessageSender == users.username
                                ? <p className='text-white text-sm'>You : {chat.lastMessage}</p>
                                : <p className='text-white text-sm'>{chat.lastMessageSender} : {chat.lastMessage}</p>
                                
                            }
                        </div>
                    </div>
                    <hr className=" ml-14 border-gray-600 border-t" />
            </div>
          ) : null}
        </div>
      ))}
        
    </div>
  )
}

export default ChatList