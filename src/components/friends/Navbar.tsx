"use client"

import React from 'react'
import { LogOut } from 'lucide-react';
import { Search } from 'lucide-react';
import { User } from 'lucide-react';
import '@/components/css/scrollbar.css';
import { useRouter } from 'next/navigation';
import { useEffect,useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { RootStateType } from '@/store/userStore';
import { pusherClient } from '@/lib/pusher';
import Friends from './Friends';
import {addFriendsRequest, updateFriends , addFriendsRequestReceived,removeFriendsRequest,removeFriendsRequestReceived,removeFriendsRequestSent, addFriendsRequestSent} from '@/store/frinedsSlice';
import Sendreq from './Sendreq';
import FriendRequest from './friendRequest';
import { UserType } from '@/model/User';
import axios from 'axios';


function Navbar() {
    const router = useRouter()
    const dispatch = useDispatch()
    const [friendsBtn,setFriendsBtn] = useState(true)
    const [requestBtn,setRequestBtn] = useState(false)
    const [sendReqBtn,setSendReqBtn] = useState(false)
    const user = useSelector((state:RootStateType) => state.user)

    useEffect(() => {
        const channel5 = pusherClient.subscribe(`user-${user._id}`);
        channel5.bind('friend-request-remove', (data : {sender : UserType}) => {
            dispatch(removeFriendsRequestReceived(data.sender))
            dispatch(addFriendsRequest(data.sender))
        })
        return ()=> {
            channel5.unbind('friend-request-remove')
            pusherClient.unsubscribe(`user-${user._id}`)
        }
    },[dispatch])

    useEffect(() => {
        const channel3 = pusherClient.subscribe(`user-${user._id}`);
        channel3.bind('friend-request-accept-receiver', (data : { reciever : UserType}) => {
            console.log("reciever : ",data.reciever)
            dispatch(removeFriendsRequestSent(data.reciever))
            dispatch(updateFriends(data.reciever))
        })
        return ()=> {
            channel3.unbind('friend-request-accept')
            pusherClient.unsubscribe(`user-${user._id}`)
        }
    },[])

    useEffect(() => {
        const channel2 = pusherClient.subscribe(`user-${user._id}`);
        channel2.bind('friend-request-reject', (data : {reciever : UserType}) => {
            console.log("reject : ",data.reciever)
            dispatch(removeFriendsRequestSent(data.reciever))
            dispatch(addFriendsRequest(data.reciever))
        })
        return ()=> {
            channel2.unbind('friend-request-reject')
            pusherClient.unsubscribe(`user-${user._id}`)
        }
    },[dispatch])

    useEffect(() => {
        console.log(`user-${user._id}`) 
        const channel = pusherClient.subscribe(`user-${user._id}`);

        channel.bind('friend-request', (data : {sender : UserType, reciever : UserType}) => {
            dispatch(addFriendsRequestReceived(data.sender))
            dispatch(removeFriendsRequest(data.sender))
        })        
        return () => {
            channel.unbind('friend-request')
            pusherClient.unsubscribe(`user-${user._id}`)
        }
    },[dispatch])

    useEffect(() => {
        if(localStorage.getItem('token') && user._id!= "") {
            
        } else {
            router.push('/chat')
        }
    },[friendsBtn,requestBtn,sendReqBtn])

  return (
    <div className='border border-gray-500 h-screen overflow-y-scroll scrollbar-thin' >
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
                <button className=' p-1 pl-2 pr-2 bg-gray-600 rounded-xl text-[#bbb] hover:bg-gray-500/55' onClick={() => {
                    setFriendsBtn(true)
                    setRequestBtn(false)
                    setSendReqBtn(false)
                }}>Friends</button>
                <button className=' p-1 pl-2 pr-2 bg-gray-600 rounded-xl text-[#bbb] hover:bg-gray-500/55' onClick={() => {
                    setFriendsBtn(false)
                    setRequestBtn(true)
                    setSendReqBtn(false)
                }}>Requests</button>
                <button className=' p-1 pl-2 pr-2 bg-gray-600 rounded-xl text-[#bbb] hover:bg-gray-500/55' onClick={() => {
                    setFriendsBtn(false)
                    setRequestBtn(false)
                    setSendReqBtn(true)
                }}>Send Request</button>
            </div>
        </div>
        <div> 
            
                {
                    friendsBtn && <Friends />
                }
                {
                    requestBtn && <FriendRequest />
                }
                {
                    sendReqBtn && <Sendreq />
                }
        </div>
    </div>
  )
}

export default Navbar