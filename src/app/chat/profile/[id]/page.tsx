"use client"
import React from 'react'
import { useSelector } from 'react-redux'
import { RootStateType } from '@/store/userStore'


function page () {
  const friends = useSelector((state:RootStateType) => state.friends)
  console.log("friends : ",friends.friends)
  return (
    <div>page : friends Details</div>
  )
}

export default page 