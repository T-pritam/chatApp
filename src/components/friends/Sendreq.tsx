"use client"

import { User } from 'lucide-react';
import '@/components/css/scrollbar.css';
import { useEffect,useState } from 'react';
import { useSelector } from 'react-redux';
import { RootStateType } from '@/store/userStore';
import { UserType } from '@/model/User';
import axios from 'axios';
import { get } from 'http';

function Sendreq() {
    const user = useSelector((state:RootStateType) => state.user)
    const [fetchedUser,setFetchedUser] = useState<UserType[]>([])  ;
    useEffect(() => {
        async function getRequests() {
            const users = await axios.get(`/api/friends/request?id=${user._id}`)
            if(users.data.status) {
                setFetchedUser(users.data.user.friendRequestReceived)        
            } else {

            }
        }
        getRequests()
    },[])

  return (
    <div>
        {
            fetchedUser.map((users) => (
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

export default Sendreq