"use client"

import { User } from 'lucide-react';
import '@/components/css/scrollbar.css';
import { useSelector,useDispatch } from 'react-redux';
import { RootStateType } from '@/store/userStore';
import {updateFriends, addFriendsRequest, addFriendsRequestReceived ,removeFriendsRequest, removeFriendsRequestReceived} from '@/store/frinedsSlice'
import axios from 'axios';
import { Check } from 'lucide-react';
import { X } from 'lucide-react';
import { pusherClient } from '@/lib/pusher';
import { useEffect,useState } from 'react';
import { UserType } from '@/model/User';
import { set } from 'mongoose';

function FriendRequest(props : { searchText : string }) {
    const dispatch = useDispatch()
    const user = useSelector((state:RootStateType) => state.user)
    const friends = useSelector((state:RootStateType) => state.friends)

  return (
    <div>
        { 
            friends.friendsRequestReceived.length === 0
            ? <p className='text-[#aaa] text-xl my-auto text-center mt-24'>No Friend Requests</p>
            : friends.friendsRequestReceived.map((users) => (
                <div className='flex justify-start p-3 gap-3 hover:bg-gray-500'>
                    <User size={48} strokeWidth={1} color='#bbb' className='rounded-full bg-gray-500 cursor-pointer mt-1'/>
                    <div className='flex w-11/12 justify-between'>
                        <p className='text-white text-xl my-auto'>{users.username}</p>
                        <div className='flex gap-3 my-auto'>
                            <div className='p-1 border-2 border-green-600 rounded-full cursor-pointer' onClick={() => {
                                axios.post('/api/friends/request', {sender : users._id, reciever : user._id, accept : true})
                                dispatch(removeFriendsRequestReceived(users))
                                dispatch(updateFriends(users))
                            }}>
                                <Check color='#2b2' className =''/>
                            </div>
                            <div className='p-1 border-2 border-red-600 rounded-full cursor-pointer' onClick={() => {
                                axios.post('/api/friends/request', {sender : users._id, reciever : user._id, accept : false})
                                dispatch(removeFriendsRequestReceived(users))
                                dispatch(addFriendsRequest(users))
                            }}>
                                <X color='#b22' className =''/>
                            </div>                    
                        </div>
                        
                    </div>
                </div>
            ))    
        } 
    </div>
)
}
export default FriendRequest