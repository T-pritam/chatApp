"use client"

import React, { useEffect,useState } from 'react'
import ChatHome from '@/components/ChatHome'
import Common from '@/components/Common'
import { useSelector,useDispatch } from 'react-redux'
import { login } from '@/store/userSlice'
import { RootStateType } from '@/store/userStore'
import { useRouter } from 'next/navigation'
import { AppDispatch } from '@/store/userStore'
import { fetchChatListById } from '@/store/chatListSlice'
import { setFriends,setFriendsRequest,setFriendsRequestReceived,setFriendsRequestSent } from '@/store/frinedsSlice'
import axios from 'axios'


function Page() {
  const dispatch = useDispatch<AppDispatch>()
  const users = useSelector((state:RootStateType) => state.user)
  const router = useRouter()
  const chatlist = useSelector((state:RootStateType) => state.chatList)


  useEffect(() => {

    async function getUser(token:string){
      const response = await axios.get('/api/user/getUser?token='+token)
      if(response.data.status){
        dispatch(login(response.data.user))
        const friends = await axios.get(`/api/friends?id=${response.data.user._id}`)
        dispatch(setFriends(friends.data.user.friends))
        const friendsRequest = await axios.get(`/api/friends/add?id=${response.data.user._id}`)
        dispatch(setFriendsRequest(friendsRequest.data.users))
        dispatch(setFriendsRequestSent(friendsRequest.data.sendReq))
        const friendsRequestReceived = await axios.get(`/api/friends/request?id=${response.data.user._id}`)
        dispatch(setFriendsRequestReceived(friendsRequestReceived.data.user.friendRequestReceived))        
      } else {
        localStorage.removeItem('token')
        router.push('/auth/signin')
      }
    }
    
    const token = localStorage.getItem('token')
    if (token){
      getUser(token)
    }
  },[])
  
  
    console.log("chatList : ",chatlist.data)
  return (
    <div >
      <Common />
    </div>
  )
}

export default Page