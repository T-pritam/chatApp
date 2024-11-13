"use client"

import React from 'react'
import { useState } from 'react'
import Common from '@/components/Common'
import AllGroup from '@/components/groups/AllGroup'

function Friends() {
    const [all,setAll] = useState<boolean>(false)
    const [create,setCreate] = useState<boolean>(false)
    const [create2,setCreate2] = useState<boolean>(false)
  return (
        <div className='flex'>
        <div className="bg-gray-700 w-2/5 h-screen inline-block relative">
            <AllGroup 
            setCreate={setCreate}
            setCreate2={setCreate2}
            setAll={setAll} />
        </div>
        <div className="bg-gray-500 flex-1 h-screen inline-block relative">
            <Common />
        </div>
    </div>
  )
}

export default Friends