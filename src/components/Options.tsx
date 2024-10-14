import React from 'react'
import { MessageSquareMore } from 'lucide-react';
import { Settings } from 'lucide-react';

function Options() {
  return (
    <div className='flex items-center justify-center'>
        <div className='flex flex-col justify-between'>
            <div className='flex flex-col items-center gap-6 justify-center'>
                <MessageSquareMore size={36} stroke='#bbb'/>
                <MessageSquareMore size={36} stroke='#bbb'/>
                <MessageSquareMore size={36} stroke='#bbb'/>
                <MessageSquareMore size={36} stroke='#bbb'/>
            </div>
            <div className='flex flex-col items-center gap-6 justify-center'> 
                <Settings size={30} stroke='#bbb'/>
            </div>
        </div>
    </div>


  )
}

export default Options