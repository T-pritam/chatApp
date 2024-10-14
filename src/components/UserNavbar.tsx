import React from 'react'
import { Search } from 'lucide-react';
import { User } from 'lucide-react';
import { EllipsisVertical } from 'lucide-react';

function UserNavbar() {
  return (
    <div className='h-16 bg-gray-900'>
        <div className='flex justify-between items-center h-full px-4'>
            <div className='flex justify-start'>
                <User size={44} strokeWidth={1} color='#bbb' className='rounded-full bg-gray-500 cursor-pointer'/>
                <p className='text-white text-md font-bold my-auto ml-4'>UserName</p>
            </div>
            <div className='flex justify-end gap-6'>
                <Search size={22} strokeWidth={2} color='#bbb' className='cursor-pointer select-bg-red-600'/>
                <EllipsisVertical size={22} strokeWidth={2} color='#bbb' className='cursor-pointer select-bg-red-600'/>
            </div>
        </div>

    </div>
  )
}

export default UserNavbar