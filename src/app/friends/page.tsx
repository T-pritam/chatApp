import React from 'react'
import Common from '@/components/Common'

import FriendRequest from '@/components/friends/friendRequest'

function Friends() {
  return (
        <div className='flex'>
        <div className="bg-gray-700 w-2/5 h-screen inline-block relative">
            <FriendRequest />
        </div>
        <div className="bg-gray-500 flex-1 h-screen inline-block relative">
            <Common />
        </div>
    </div>
  )
}

export default Friends