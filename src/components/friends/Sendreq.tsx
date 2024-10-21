"use client"

import { User } from 'lucide-react';
import '@/components/css/scrollbar.css';
import { useSelector,useDispatch } from 'react-redux';
import { RootStateType } from '@/store/userStore';
import axios from 'axios';
import { removeFriendsRequest, addFriendsRequestSent, removeFriendsRequestSent, addFriendsRequest } from '@/store/frinedsSlice'
import { send } from 'process';

function Sendreq() {
    const dispatch = useDispatch()
    const user = useSelector((state:RootStateType) => state.user)
    const friends = useSelector((state:RootStateType) => state.friends)

  return (
    <div>
        {
            friends.friendsRequest.length == 0 && friends.friendsRequestSent.length == 0
            ? <p className='text-[#aaa] text-xl my-auto text-center mt-24'>No Friends</p>
            : friends.friendsRequest.map((users) => (
                <div className='flex justify-start p-3 gap-3 hover:bg-gray-500'>
                    <User size={48} strokeWidth={1} color='#bbb' className='rounded-full bg-gray-500 cursor-pointer mt-1'/>
                    <div className='flex w-11/12 justify-between'>
                        <p className='text-white text-xl my-auto'>{users.username}</p>
                        <button className='py-0 pl-2 pr-2 bg-gray-600 rounded-xl text-[#bbb] z-10' onClick={async() => {
                            const res = await axios.post('/api/friends/add', {sender : user._id, reciever : users._id,send : true})
                            dispatch(removeFriendsRequest(users))
                            dispatch(addFriendsRequestSent(users))
                        }}>Add +</button>
                    </div>
                </div>
            ))
        } 
        {
            friends.friendsRequestSent.map((users) => (
                <div className='flex justify-start p-3 gap-3 hover:bg-gray-500'>
                    <User size={48} strokeWidth={1} color='#bbb' className='rounded-full bg-gray-500 cursor-pointer mt-1'/>
                    <div className='flex w-11/12 justify-between'>
                        <p className='text-white text-xl my-auto'>{users.username}</p>
                        <button className='py-0 pl-2 pr-2 bg-gray-600 rounded-xl text-[#bbb] z-10' onClick={async() => {
                            const res = await axios.post('/api/friends/add', {sender : user._id, reciever : users._id, send : false})
                            dispatch(removeFriendsRequestSent(users))
                            dispatch(addFriendsRequest(users))
                        }}>Remove</button>
                    </div>
                </div>
            ))
        }
    </div>
  )
}

export default Sendreq