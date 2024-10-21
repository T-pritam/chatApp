"use client"

import React from 'react'
import ChatMessage from '@/components/ChatMessage'
import { useEffect,useState } from 'react'
import { UserType } from '@/model/User'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootStateType } from '@/store/userStore'
import axios from 'axios'

function page({params}:{params :{
        id: string
    }}) 
    {
        const Router = useRouter()
        const [friend, setFriend] = useState({} as UserType)
        useEffect(() => {
            async function getDetails(){
                const response = await axios.get(`/api/user/getUserbyId?id=${params.id}`)
                setFriend(response.data.user)
            }

            getDetails()

        },[])
  return (
    <div>
        <div onClick={() => Router.push(`/chat/${params.id}/profile`)}> 
            <ChatMessage 
                username = {friend.username}
                about = {friend.about}
                email = {friend.email}
            />
        </div>
    </div>
  )
}

export default page