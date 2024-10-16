"use client"

import React from 'react'
import ChatHome from '@/components/ChatHome'
import ChatMessage from '@/components/ChatMessage'
import { useSelector } from 'react-redux'
import { RootStateType } from '@/store/userStore'
import { useEffect, useState } from 'react'


function Page() {
  const [users, setUsers] = useState({})
  const user = useSelector((state: RootStateType) => state.user);
  console.log("user : ",user)

  return (
    <div>
      <ChatMessage />
    </div>
  )
}

export default Page