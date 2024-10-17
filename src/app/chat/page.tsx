"use client"

import React, { useEffect,useState } from 'react'
import ChatHome from '@/components/ChatHome'
import Common from '@/components/Common'
import { useSelector,useDispatch } from 'react-redux'
import { login } from '@/store/userSlice'
import { RootStateType } from '@/store/userStore'
import { useRouter } from 'next/navigation'
import { UserState } from '@/store/userSlice'
import axios from 'axios'


function Page() {
  const dispatch = useDispatch()
  const users = useSelector((state:RootStateType) => state.user)
  const router = useRouter()


  useEffect(() => {

    async function getUser(token:string){
      const response = await axios.get('/api/getUser?token='+token)
      if(response.data.status){
        dispatch(login(response.data.user))
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
  

  return (
    <div >
      <Common />
    </div>
  )
}

export default Page