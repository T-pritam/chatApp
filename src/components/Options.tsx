import React from 'react'
import { MessageSquareMore } from 'lucide-react';
import { Settings } from 'lucide-react';
import { User } from 'lucide-react';

function Options() {
  return (
    <div className='flex items-center justify-center flex-col  h-full'>

  <div className="flex flex-col justify-between h-full">
    
    
    <div className="space-y-5">
        <MessageSquareMore size={36} stroke='#bbb'/>
        <MessageSquareMore size={36} stroke='#bbb'/>
        <MessageSquareMore size={36} stroke='#bbb'/>
        <MessageSquareMore size={36} stroke='#bbb'/>
    </div>

    
    <div className="space-y-6">
    <Settings size={30} stroke='#bbb'/>
    <User size={34} strokeWidth={1} color='#bbb' className='rounded-full bg-gray-700 cursor-pointer'/>
    </div>

  </div>

        {/* <div className='flex flex-col justify-between align-center'>
            <div className='flex flex-col items-center gap-6 '>
                
            </div>
            <div className='flex flex-col items-center gap-6 '> 
                
            </div>
        </div> */}
    
    </div>
  )
}

export default Options