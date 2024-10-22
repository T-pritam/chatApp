"use client"

import React from 'react'
import ChatMessage from '@/components/ChatMessage'
import { useEffect,useState } from 'react'
import { UserType } from '@/model/User'
import { UserState } from '@/store/userSlice'
import UserDetails from '@/components/UserDetails'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootStateType } from '@/store/userStore'
import axios from 'axios'
import { get } from 'http'
import UserNavbar from '@/components/UserNavbar'

interface usertype{
    username : string,
    about : string,
    email : string
}

function page({params}:{params :{ id : string }}) 
    {
        const friends = useSelector((state:RootStateType) => state.friends)
        const user = useSelector((state:RootStateType) => state.user)
        const Router = useRouter()
        const [friend, setFriend] = useState<UserState|null>(null)
        const [Details, setDetails] = useState(false)
        useEffect(() => {
            if(!localStorage.getItem('token') || user._id == ""){
                Router.push(`/chat`)
            }
            const getFriend = friends.friends.find((user) => user._id == params.id) || null
            console.log("getFriend : ",getFriend)
            if (getFriend == null) {
                Router.push(`/chat`)
            } else {
                setFriend(getFriend)
            }
        },[])
  return (
    <div>
        {
            friend == null
            ? <div>loading</div>
            :
        <div>
            {
            Details 
            ? <div onClick={() => setDetails(false)}>
                <UserDetails  
                    username={friend.username} 
                    about = {friend.about} 
                    email = {friend.email}
                    setDetails = {setDetails}
                />
              </div>
            : <ChatMessage id={friend._id} username={friend.username} about = {friend.about} email = {friend.email} setDetails = {setDetails}/>
        }
        </div>
    }
    </div>
  )
}

export default page