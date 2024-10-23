"use client"
import React from 'react'
import { LogOut } from 'lucide-react';
import { Search } from 'lucide-react';
import { User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootStateType } from '@/store/userStore';
import {useState,useEffect } from 'react';
import '@/components/css/scrollbar.css';
import { IoClose } from "react-icons/io5";
import { UserState } from '@/store/userSlice';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import CreateGroup from '../groups/CreateGroup';
import axios from 'axios';

function Grouplist() {
    const router = useRouter()
    const friends = useSelector((state:RootStateType) => state.friends)
    const [friendsList,setFriendsList] = useState<UserState []>([])
    const [searchBtn,setSearchBtn] = useState<string>("")
    const [searchText,setSearchText] = useState<string>("")
    const [defaultBtn,setDefaultBtn] = useState<boolean>(true)
    const [createBtn,setCreateBtn] = useState<boolean>(false)
    const [all,setAll] = useState<boolean>(false)
    const [debouncedSearchText] = useDebounce(searchBtn, 800);

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
                <p className='text-2xl font-bold text-white'>Groups</p>
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
                    }}/>
                }
                
            </div>

            <div className='flex justify-start mt-3 gap-3'>
                <button className={`p-1 pl-2 pr-2 bg-gray-600 rounded-xl text-[#bbb] hover:bg-gray-500/35 ${all ? "bg-gray-500/35" : ""}`}  onClick={() => {
                    setAll(true)
                    setCreateBtn(false)
                }}>All</button>
                <button className={`p-1 pl-2 pr-2 bg-gray-600 rounded-xl text-[#bbb] hover:bg-gray-500/55 ${createBtn ? "bg-gray-500/55" : ""}`} onClick={() => {
                    setAll(false)
                    setCreateBtn(true)
                }}>Create Group</button>
            </div>

        </div>

        
        <div>
            
        </div>
        
        
    </div>
  )
}

export default Grouplist;