"use client"
import React from 'react'
import { LogOut } from 'lucide-react';
import { Search } from 'lucide-react';
import { User } from 'lucide-react';
import '@/components/css/scrollbar.css';
import { useRouter } from 'next/navigation';
import { useEffect,useState } from 'react';
import { useSelector } from 'react-redux';
import { RootStateType } from '@/store/userStore';
import { UserType } from '@/model/User';
import axios from 'axios';

function FriendRequest() {
    const router = useRouter()
    const [friendsBtn,setFriendsBtn] = useState(true)
    const [requestBtn,setRequestBtn] = useState(false)
    const [sendReqBtn,setSendReqBtn] = useState(false)
    const user = useSelector((state:RootStateType) => state.user)
    const [fetchedUser,setFetchedUser] = useState<UserType[]>([])  ;
    useEffect(() => {
        async function getUsers() {
            const users = await axios.get('/api/friendReq?id='+user._id)
            if(users.data.status) {
                setFetchedUser(users.data.users)        
            }
        }
        if(localStorage.getItem('token') && user._id!= "") {
            getUsers()
        } else {
            router.push('/chat')
        }
    },[friendsBtn,requestBtn,sendReqBtn])

  return (
    <div className=' border border-gray-500 h-screen overflow-y-scroll scrollbar-thin' >
        <div className='sticky top-0 z-10 bg-gray-700 pb-2 p-4'>
            <div className='flex justify-between'>
                <p className='text-2xl font-bold text-[#ddd]'>Send Friend Request</p>
                <LogOut color='#bbb' className='cursor-pointer select-bg-red-600' onClick={() => {
                    localStorage.removeItem('token')
                    router.push('/auth/signin')
                }}/>
            </div>  

            <div className='mt-6 w-full h-9 bg-gray-500 p-1 pl-4 pr-4 rounded-xl'>
                <Search size={20} stroke='#bbb' className='inline-block absolute mt-1'/>
                <input type="text" className='ml-12 h-7 rounded-md bg-gray-500 relative outline-none' placeholder='Search'/>
            </div>
            <div className='flex justify-start mt-3 gap-3'>
                <button className=' p-1 pl-2 pr-2 bg-gray-600 rounded-xl text-[#bbb] hover:bg-gray-500/55'>Friends</button>
                <button className=' p-1 pl-2 pr-2 bg-gray-600 rounded-xl text-[#bbb] hover:bg-gray-500/55'>Requests</button>
                <button className=' p-1 pl-2 pr-2 bg-gray-600 rounded-xl text-[#bbb] hover:bg-gray-500/55'>Send Request</button>
            </div>
        </div>

            {
                fetchedUser.map((users) => (
                    <div className='flex justify-start p-3 gap-3 hover:bg-gray-500' onClick={() => console.log("Clicked")}>
                        <User size={48} strokeWidth={1} color='#bbb' className='rounded-full bg-gray-500 cursor-pointer mt-1'/>
                        <div className='flex w-4/5 justify-between'>
                            <p className='text-white text-xl my-auto'>{users.username}</p>
                            <button className='py-0 pl-2 pr-2 bg-gray-600 rounded-xl text-[#bbb] z-10' onClick={async() => {
                                const res = await axios.post('/api/friendReq/add', {sender : user._id, reciever : users._id})

                            }}>Add +</button>
                        </div>
                    </div>
                ))
            }        
    </div>
  )
}

export default FriendRequest