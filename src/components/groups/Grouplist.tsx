"use client"
import React from 'react'
import { useState } from 'react';
import CreateGroup from './CreateGroup';
import AllGroup from './AllGroup';
import '@/components/css/scrollbar.css';


function Grouplist() {
    const [createBtn,setCreateBtn] = useState<boolean>(false)
    const [all,setAll] = useState<boolean>(true)


    
  return (
    <div className=' border border-gray-500 h-screen overflow-y-scroll scrollbar-thin' >
        {
            createBtn && <CreateGroup setCreate={setCreateBtn} setAll={setAll}/>
        } 
        {
            all  && <AllGroup setCreate={setCreateBtn} setAll={setAll}/>
        }        
        
    </div>
  )
}

export default Grouplist;