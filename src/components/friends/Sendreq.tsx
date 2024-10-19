"use client"

import { User } from 'lucide-react';
import '@/components/css/scrollbar.css';
import { useEffect,useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { RootStateType } from '@/store/userStore';
import { UserType } from '@/model/User';
import axios from 'axios';
import {updateFriends, updateFriendsRequest, updateFriendsRequestReceived} from '@/store/frinedsSlice'

function Sendreq() {
    const dispatch = useDispatch()
    const user = useSelector((state:RootStateType) => state.user)
    const friends = useSelector((state:RootStateType) => state.friends)
    const [fetchedUser,setFetchedUser] = useState<UserType[]>([])  ;
    const [count,setCount] = useState(0)

    useEffect(() => {
        setFetchedUser(friends.friendsRequest as UserType[])
        setCount(friends.friendsRequest.length)
    },[friends.friendsRequest])
   

  return (
    <div>
        {
            count == 0 
            ? <p className='text-[#aaa] text-xl my-auto text-center mt-24'>No Friends</p>
            : fetchedUser.map((users) => (
                <div className='flex justify-start p-3 gap-3 hover:bg-gray-500'>
                    <User size={48} strokeWidth={1} color='#bbb' className='rounded-full bg-gray-500 cursor-pointer mt-1'/>
                    <div className='flex w-11/12 justify-between'>
                        <p className='text-white text-xl my-auto'>{users.username}</p>
                        <button className='py-0 pl-2 pr-2 bg-gray-600 rounded-xl text-[#bbb] z-10' onClick={async() => {
                            const res = await axios.post('/api/friends/add', {sender : user._id, reciever : users._id})
                            dispatch(updateFriendsRequest(users))
                        }}>Add +</button>
                    </div>
                </div>
            ))
        } 
    </div>
  )
}

export default Sendreq